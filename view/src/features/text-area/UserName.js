import { Input } from 'antd';
import React from 'react';
import propTypes from 'prop-types';
import styles from './UserName.module.css';

function UserName({userName, isLogin, onChange, onConfirm}) {

    const placeholderText = "press enter to confirm nick name...";
    
    const onEnter = (e) => {
        onConfirm(userName);
    }
    
    return (
        isLogin
        ? <div className={styles.loginUserName}>NickName: {userName}</div>
        : (
            <div className={styles.layout}>
                <div className={styles.label}>What&#39;s yout nick name?</div>
                <Input value={userName} onChange={onChange} onPressEnter={onEnter} placeholder={placeholderText}/>
            </div>
        )
    );
}

UserName.defaultProps = {
    isLogin: false,
    userName: ''
}

UserName.propTypes = {
    isLogin: propTypes.bool,
    userName: propTypes.string,
    onChange: propTypes.func,
    onConfirm: propTypes.func
}

export default UserName;