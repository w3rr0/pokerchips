import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import Button from "./Button.jsx";
import PinInput from "./PinInput.jsx";
import {apiUrl} from "../../public/static.js";
import GithubLink from "./GithubLink.jsx";
import { defaultAmount } from "../../public/static.js";
import SliderInput from "./SliderInput.jsx";

const JoinRoom = () => {
    const navigate = useNavigate();
    const [pin, setPin] = useState('')
    const playerId = useRef(localStorage.getItem('playerId') || crypto.randomUUID()).current
    const {state} = useLocation()
    const {username} = state || {}
    const [errorMessage, setErrorMessage] = useState('')
    const [startingAmount, setStartingAmount] = useState(defaultAmount)

    useEffect(() => {
        localStorage.setItem('playerId', playerId)
    }, [playerId])

    const handleJoinRoom = async () => {
        if (pin.length !== 6) {
            setErrorMessage("PIN must be 6-digit long")
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/check_room/${pin}`);

            const data = await response.json();

            if (response.ok) {
                if (data.allow) {
                    navigate(`/room/${pin}`, {state: { username, playerId, startingAmount }})
                } else {
                    setErrorMessage(data.room_status || "Unknown error")
                }
            } else if (response.status === 404) {
                setErrorMessage(data.room_status || "Unknown error")
            }
        } catch (err) {
        console.log("fetch error", err);
    }
}

    return (
        <div className="menu-container">
            <img src="/pokerchips.png" alt="POKERCHIP$" width="300px" style={{ display: 'block', margin: "0 auto", cursor: "pointer" }} onClick={() => navigate("/")} />

            <div className="section center">
                <h2>Join Existing Room</h2>
                <div className="slider-wrapper" >
                    <SliderInput value={startingAmount} handleChange={setStartingAmount} />
                </div>
                <div className="gap15" />
                <PinInput onChange={setPin}/>
                <label style={{ paddingBottom: "20px", display: "block", textAlign: "center" }} className="username-warning">{errorMessage}</label>
                <Button caption={"Join Existing Room"} onClick={handleJoinRoom}></Button>
            </div>
            <GithubLink/>
        </div>
    )
}

export default JoinRoom