import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './context';
import { useDropzone } from 'react-dropzone';

function Settings() {

  const [previewSrc, setPreviewSrc] = useState(null);

  // States for handling password match
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [imageUploaded, setImageUploaded] = useState(false); // 照片上傳狀態

  useEffect(() => {
    setPasswordsMatch(newPassword === retypePassword);
  }, [newPassword, retypePassword]);

  const [formData, setFormData] = useState({
    username: '',
    nickName: '',
    gender: '',
    birth: '',
    phoneNum: '',
    email: '',
  });

  const navigate = useNavigate();
  const { userId, setAvatarUrl } = useContext(UserContext);

  useEffect(() => {

    console.log('Fetched userId:', userId);

    const token = localStorage.getItem('token'); // 從 localStorage 中讀取 token

    // 這裡可以用 GET 請求獲取用戶信息並設置到 formData 中
    //  API 地址
    axios.get(`http://localhost:8080/api/auth/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // 添加 Authorization header
      }
    })
      .then(response => {
        console.log(response.data); // 檢查返回的資料
        const userData = response.data;

        // 檢查 gender 是否存在，並處理
        const updatedGender = userData.gender
          ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1).toLowerCase()
          : '';  // 如果 gender 為 null 或 undefined，設定為空字串

        const updatedFormData = {
          ...userData,
          gender: updatedGender,
        };

        setFormData(updatedFormData); // 更新 formData 的值
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  //更新個人資料
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // 使用react-dropzone處理圖片拖放上傳和預覽
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFormData(prevData => ({ ...prevData, image: file }));

    // 建立圖片預覽的URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewSrc(previewUrl);
    setImageUploaded(true); // 設置照片上傳狀態為已上傳
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  // 密碼變更處理器
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'settingsNewPassword') {
      setNewPassword(value);
    } else if (name === 'settingsRetypePassword') {
      setRetypePassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // 從 localStorage 中讀取 token

    // 使用 FormData 來處理包含文件的表單數據
    const formDataToSend = new FormData();

    // 將表單的其他資料加入到 FormData 中
    formDataToSend.append("nickName", formData.nickName);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("birth", formData.birth);
    formDataToSend.append("phoneNum", formData.phoneNum);
    formDataToSend.append("email", formData.email);

    // 如果有新密碼，將其加入到 FormData 中
    if (newPassword) {
      formDataToSend.append("password", newPassword);
    }

    // 如果有圖片文件，將圖片加入到 FormData 中
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    // 這裡可以發送 PUT 請求來更新用戶數據，使用 username 來動態構建 PUT API 地址
    axios.put(`http://localhost:8080/api/auth/${userId}`, formDataToSend, {
      headers: {
        'Authorization': `Bearer ${token}`,// 添加 Authorization header
        'Content-Type': 'multipart/form-data' // 確保這裡的 Content-Type 是正確的
      }
    })
      .then(response => {
        alert('資料更新成功！');

        const updatedImagePath = response.data.imagePath; // 從後端的回應中提取新的圖片路徑

        // 更新 localStorage 中的圖片路徑
        if (updatedImagePath) {
          const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
          const fullImageUrl = `${baseUrl}${updatedImagePath}`;
          localStorage.setItem('userImage', updatedImagePath); // 更新 localStorage 中的 userImage
          setAvatarUrl(fullImageUrl); // 更新 UserContext 中的 avatarUrl
        }

        // 清空密碼欄位
        setNewPassword('');
        setRetypePassword('');
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  return (
    <div className="Settings">
      <>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" type="image/png" href="assets/images/logo-16x16.png" />
        {/* The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags */}
        <title>Argon - Social Network</title>
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css?family=Major+Mono+Display"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/boxicons@1.9.2/css/boxicons.min.css"
          rel="stylesheet"
        />
        {/* Styles */}
        <link href="assets/css/bootstrap/bootstrap.min.css" rel="stylesheet" />
        <link href="assets/css/style.css" rel="stylesheet" />
        <link href="assets/css/components.css" rel="stylesheet" />
        <link href="assets/css/settings.css" rel="stylesheet" />
        <link href="assets/css/forms.css" rel="stylesheet" />
        <link href="assets/css/media.css" rel="stylesheet" />
        <div className="container-fluid newsfeed d-flex" id="wrapper">
          <div className="row newsfeed-size f-width">
            <div className="col-md-12 message-right-side">

              <div className="row message-right-side-content">
                <div className="col-md-12">
                  <div id="message-frame">
                    <div className="message-sidepanel">
                      <div className="message-contacts settings-sidebar">
                        <ul className="conversations">
                          <h6 className="p-3">General Settings</h6>
                          <li className="contact setting-active">
                            <a
                              href="/settings"
                              className="wrap d-flex align-items-center"
                            >
                              <img
                                src="assets/images/icons/settings/account.png"
                                className="settings-icon"
                                alt="Settings left sidebar"
                              />
                              <div className="meta">
                                <p>Personal Information</p>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="content">
                      <div className="settings-form p-4">
                        <h2>Personal Information</h2>
                        <form onSubmit={handleSubmit} className="mt-4 settings-form">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-row mb-3 align-items-center">
                                <div className="col">
                                  <label htmlFor="settingsUsername">Username</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Username"
                                    disabled // 假設不允許修改 username
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-row mb-3 align-items-center">
                                <div className="col">
                                  <label htmlFor="settingsNickName">NickName</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="nickName"
                                    value={formData.nickName || ''}
                                    onChange={handleInputChange}
                                    placeholder="NickName"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="settingsGender">Gender</label>
                                <select
                                  className="form-control"
                                  name="gender"
                                  value={formData.gender}
                                  onChange={handleInputChange}
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="settingsBirth">Birth</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="birth"
                                  value={formData.birth || ''}
                                  onChange={handleInputChange}
                                  placeholder="1900-01-01"
                                />
                              </div>
                            </div>
                            <div className="col-md-4">

                              <div className="form-group">
                                {/* 使用react-dropzone來實現拖放上傳 */}
                                {!imageUploaded && (
                                  <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                      <p>拖放圖片至此...</p>
                                    ) : (
                                      <p>拖拉或點擊上傳圖片</p>
                                    )}
                                  </div>
                                )}
                                {/* Image Preview */}
                                {previewSrc && (
                                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <img src={previewSrc} alt="預覽圖片" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="settingsCurrentPassword">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="currentpassword"
                                  placeholder="Current Password"
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="settingsNewPassword">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="settingsNewPassword"
                                  placeholder="New Password"
                                  value={newPassword}
                                  onChange={handlePasswordChange}
                                />

                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="settingsRetypePassword">
                                  Re-type New Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="settingsRetypePassword"
                                  placeholder="Re-type New Password"
                                  value={retypePassword}
                                  onChange={handlePasswordChange}
                                />
                                {!passwordsMatch && (
                                  <small className="text-danger">
                                    <i className="bx bx-x error" /> Passwords do not match
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="settingsPhoneNumber">
                                  Phone Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="phoneNum"
                                  value={formData.phoneNum || ''}
                                  onChange={handleInputChange}
                                  placeholder="Phone Number"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-row mb-3 align-items-center">
                                <div className="col">
                                  <label htmlFor="settingsEmailAddress">
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 d-flex justify-content-end" style={{ position: "fixed", bottom: "20px", right: "20px" }}>
                            <button type="submit" className="btn btn-primary btn-sm">
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Core */}
        {/* Optional */}
      </>

    </div>
  );
}

export default Settings;