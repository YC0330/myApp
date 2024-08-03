import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import api from '../libs/api';
const Profile = () => {
    const [user, setUser] = useState({ username: '', email: '', phone: '', avatar: '' });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/users')
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                toast.error("Failed to fetch user data");
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        axios.put('/api/users', user)
            .then(response => {
                setUser(response.data);
                setEditing(false);
                toast.success("Profile updated successfully");
            })
            .catch(error => {
                toast.error("Failed to update profile");
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser(prevState => ({
                ...prevState,
                avatar: reader.result
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-container">
            <ToastContainer />
            {editing ? (
                <div className="profile-edit">
                    <div className="avatar-upload">
                        <label htmlFor="avatar">
                            <img src={user.avatar || '../../logo.png'} alt="Avatar" />
                        </label>
                        <input type="file" id="avatar" onChange={handleFileChange} />
                    </div>
                    <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username" />
                    <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
                    <input type="text" name="phone" value={user.phone} onChange={handleChange} placeholder="Phone" />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div className="profile-view">
                    <div className="avatar">
                        <img src={user.avatar || '../../logo.png'} alt="Avatar" />
                    </div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    <button onClick={() => setEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
