import { Chart } from 'react-google-charts';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from './context';
import axios from 'axios';
import { data } from 'jquery';
import Intro from './intro';
import Recentmedia from './recentmedia';
import ProfileList from './profilelist';
import Avatar from './avatar';
import Cover from './cover';
import Follow from './follow';
import MiniPhoto from './miniphoto';

function Profile() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [formData, setFormData] = useState({
        nickName: '',
        username: ''

    });
    //const { userId } = useContext(UserContext);
    const urlUserId = params.get('userId'); // 從查詢參數中獲取 userId
    const storedUserId = localStorage.getItem('userId');
    const userId = urlUserId || storedUserId; // 使用 URL 或 localStorage 中的 userId
    const [setPosts] = useState([]);  // New state for posts
    const [moodData, setMoodData] = useState();
    const [isCurrentUser, setIsCurrentUser] = useState(false); //
    const [isFollowing, setIsFollowing] = useState(false);  // 是否已經追蹤

    useEffect(() => {

        const currentUserId = localStorage.getItem('userId');
        setIsCurrentUser(userId === currentUserId);

        console.log('Fetched userId:', userId);
        console.log('Query userId:', userId);

        // 從後端獲取用戶資料
        const token = localStorage.getItem('token'); // 假設 token 已存儲在 localStorage 中

        axios.get(`http://localhost:8080/api/auth/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // 設置 Authorization 標頭
            }
        })
            .then(response => {
                const userData = response.data;
                setFormData({
                    nickName: userData.nickName,  // 假設後端返回的資料包含 nickName 和 username
                    username: userData.username,
                });
            })
            .catch(error => {
                console.error("獲取用戶資料時發生錯誤:", error);
            });

        // Fetch posts by user ID
        axios.get(`http://localhost:8080/posts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            //}).then(response => {
            //    setPosts(response.data);  // Update the posts state with the response

        }).catch(error => {
            console.error("Error fetching posts:", error);
        });

        console.log('URL 中的 userId:', userId);

    }, [userId]);

    // 這裡的函數需要被立即調用
    const fetchData = async () => {
        try {
            //const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");

            const response = await axios.post(
                `http://localhost:8080/yearReview/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 設置 Authorization 標頭
                    },
                }
            );
            console.log(response.data); // 請求成功後打印 response 的數據
            setMoodData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error); // 捕獲錯誤
        }
    };
    useEffect(() => {
        fetchData(); // 調用函數

    }, [userId]); // 這裡添加空依賴數組，確保 useEffect 只運行一次

    return (
        <div className="Profile">

            <>
                <meta charSet="utf-8" />
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
                <link href="assets/css/profile.css" rel="stylesheet" />
                <link href="assets/css/media.css" rel="stylesheet" />
                <div className="container-fluid newsfeed " id="wrapper">
                    <div className="row newsfeed-size">
                        <div className="col-md-12 p-0">
                            <div className="row profile-right-side-content">
                                <div className="user-profile">
                                    <Cover />
                                    <div className="row profile-rows">
                                        <div className="col-md-3">
                                            <div className="profile-info-left">
                                                <div className="text-center">
                                                    <div className="profile-img w-shadow">
                                                        <Avatar />
                                                    </div>
                                                    <p className="profile-fullname mt-3">{formData.nickName || 'Your Nickname'}</p>
                                                    <p className="profile-username mb-3 text-muted">
                                                        @{formData.username || 'username'}
                                                    </p>
                                                </div>
                                                <Follow />
                                                <div className="intro mt-5 mv-hidden">
                                                    <div className="intro-item d-flex justify-content-between align-items-center">
                                                        <h3 className="intro-about">Intro</h3>
                                                    </div>
                                                    <Intro />

                                                </div>
                                                <MiniPhoto />
                                            </div>
                                        </div>
                                        <div className="col-md-9 p-0">
                                            <div className="profile-info-right">
                                                {/* Posts section */}
                                                <div className="row">
                                                    <div className="col-md-9 profile-center">
                                                        <ul className="list-inline profile-links d-flex justify-content-between w-shadow rounded">
                                                            <li className="list-inline-item profile-active">
                                                                <a href={`/profile?userId=${userId}`}>Timeline</a>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <a href={`/about?userId=${userId}`}>About</a>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <a href={`/friends?userId=${userId}`}>Friends</a>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <a href={`/photo?userId=${userId}`}>Photos</a>
                                                            </li>

                                                        </ul>

                                                        <div className="bg-white profile-posts-options mt-5 mb-4 py-3 justify-content-between shadow-sm" >
                                                            <Container >
                                                                <Row className="justify-content-center" >
                                                                    <Col md={1} lg={1} xl={1}></Col>
                                                                    <Col>
                                                                        <CalendarChart isCurrentUser={isCurrentUser} moodData={moodData} />
                                                                    </Col>
                                                                    <Col md={1} lg={1} xl={1}></Col>
                                                                </Row>
                                                            </Container>
                                                        </div>
                                                        <ProfileList />
                                                        <div
                                                            className="border-top pt-3 hide-comments"
                                                            style={{ display: "none" }}
                                                        >
                                                            <div className="row bootstrap snippets">
                                                                <div className="col-md-12">
                                                                    <div className="comment-wrapper">
                                                                        <div className="panel panel-info">
                                                                            <div className="panel-body">
                                                                                <ul className="media-list comments-list">

                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Recentmedia />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New message modal */}
                <div
                    className="modal fade"
                    id="newMessageModal"
                    tabIndex={-1}
                    role="dialog"
                    aria-labelledby="newMessageModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header new-msg-header">
                                <h5 className="modal-title" id="newMessageModalLabel">
                                    Start new conversation
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body new-msg-body">
                                <form action="" method="" className="new-msg-form">
                                    <div className="form-group">
                                        <label htmlFor="message-text" className="col-form-label">
                                            Message:
                                        </label>
                                        <textarea
                                            className="form-control search-input"
                                            rows={5}
                                            id="message-text"
                                            placeholder="Type a message..."
                                            defaultValue={""}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer new-msg-footer">
                                <button type="button" className="btn btn-primary btn-sm">
                                    Send message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Core */}
                {/* Optional */}
            </>

        </div >
    );
}

function CalendarChart({ isCurrentUser }) {
    if (!isCurrentUser) {
        return null;
    }
    const data = [
        [{ type: 'date', id: 'Date' }, { type: 'number', id: 'Mood Score' }],
        [new Date(2024, 5, 12), 3],
        [new Date(2024, 8, 5), 10],
        [new Date(2024, 0, 16), 4],
        [new Date(2024, 5, 16), 9],
        [new Date(2024, 9, 18), 5],
        [new Date(2024, 10, 18), 5],
        [new Date(2024, 10, 26), 3],
        [new Date(2024, 4, 8), 9],
        [new Date(2024, 1, 16), 8],
        [new Date(2024, 5, 1), 9],
        [new Date(2024, 8, 2), 8],
        [new Date(2024, 11, 15), 5],
        [new Date(2024, 5, 11), 2],
        [new Date(2024, 6, 18), 9],

    ];


    const options = {
        title: "Your Mood for 2024",
        height: 350,
        calendar: {
            cellSize: 11,  // 單元格大小
            dayOfWeekLabel: {
                fontName: 'Arial',
                fontSize: 14,
                color: '#666',
            },
            monthLabel: {
                fontName: 'Arial',
                fontSize: 18,
                color: '#333',
            },
            focusedCellColor: {
                stroke: '#ff0000',
                strokeOpacity: 0.8,
            },
            colorAxis: {
                minValue: 0,
                maxValue: 10,
                colors: ['#ffffff', '#00008b'],  // 白色到深藍色
            },
        },
    };

    return (

        <div style={{ width: '100%', maxWidth: '650px', aspectRatio: '5 / 1', }}>
            <Chart
                chartType="Calendar"
                data={data}
                options={options}
                width="100%"  // 寬度設為 100%
                height="auto"  // 高度設為 100%
                loader={<div>Loading Chart...</div>}
            />
        </div>

    );
}

export default Profile;