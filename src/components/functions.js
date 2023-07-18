import React, { useState } from 'react'
import ROSLIB from 'roslib'

function SendMessage() {

    const [status, setStatus] = useState("Not connected")
    const [topicMsg, setTopicMsg] = useState({ data: '' })
    const [rcvdMsg, setRcvdMsg] = useState('')
    const ros = new ROSLIB.Ros({encoding: 'ascii'})

    function connect() {

        if (status !== 'Connected!') {
            // ros.connect("ws://192.168.0.22:9090")  // [ROS2] bridged network
            // ros.connect("ws://192.168.64.2:9090")  // [ROS2] shared network
            ros.connect("ws://192.168.0.27:9091")  // [ROS1] bridged network
            // won't let the user connect more than once
            ros.on('error', function (error) {
                console.log(error)
                setStatus(error)
            })

            // Find out exactly when we made a connection.
            ros.on('connection', function () {
                console.log('Connected!')
                setStatus("Connected!")
            })

            ros.on('close', function () {
                console.log('Connection closed')
                setStatus("Connection closed")
            })
        }
    }

    function publish() {
        connect()

        const cmdVel = new ROSLIB.Topic({
            ros: ros,
            // name: "robot_news",
            // messageType: "example_interfaces/String"
            name: "robot_news_radio",
            messageType: "std_msgs/String"
        })

        const data = new ROSLIB.Message({
            data: topicMsg.data
        });

        // publishes to the queue
        console.log('msg', data)
        cmdVel.publish(data)
    }

    function subscribe() {
        connect()

        // Subscribing to a Topic
        // ----------------------
        // const listener = new ROSLIB.Topic({
        //     ros : ros,
        //     name : '/robot_news',
        //     messageType : 'example_interfaces/String'
        // });

        const listener = new ROSLIB.Topic({
            ros : ros,
            name : '/robot_news_radio',
            messageType : 'std_msgs/String'
        });

        listener.subscribe(function(message) {
            console.log('Received message on ' + listener.name + ': ' + message.data);
            setRcvdMsg(message.data);
            listener.unsubscribe();
        });
    }

    return (
        <div>
            <div>
                {status}
            </div>
            <div>
                {rcvdMsg}
            </div>
            <label>News</label>
            <input name={"topicMsg"} type={"string"} value={topicMsg.data} onChange={(ev) => setTopicMsg({...topicMsg, data: ev.target.value})}/>
            <br />
            <button onClick={() => connect()}>Connect</button>
            <button onClick={() => subscribe()}>Subscribe</button>
            <button onClick={() => publish()}>Publish</button>
            <br/>
        </div>
    )
}

export default SendMessage
