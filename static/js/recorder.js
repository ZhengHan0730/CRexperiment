import rrweb from "rrweb";

// 将 events 数组定义在函数外部
let events = [];
let stopRecording = null; // This function will be defined when recording starts

function startRecording() {
    // 清空之前的录制数据
    events = [];

    // Start recording
    console.log('-----Start recording-----');
    stopRecording = rrweb.record({
        emit(event) {
            // Push each event into the events array
            events.push(event);
        },
        // Include any other rrweb recording options here
    });
}

function stopAndHandleRecording() {
    console.log('-----Stop recording-----');
    if (stopRecording) {
        stopRecording(); // Stop recording
        stopRecording = null;

        // Handle the recorded events here
        fetch('/save-rrweb-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ events }),
        })
            .then(response => {
                if (!response.ok) {
                    // 处理响应失败的情况
                    console.error('Failed to save rrweb data');
                }
            })
            .catch(error => {
                // 处理网络错误
                console.error('Network error:', error);
            });

        // Reset the events array
        events = [];
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('button-continue');
    const completeButton = document.getElementById('review-completed');

    startButton?.addEventListener('click', startRecording);
    completeButton?.addEventListener('click', stopAndHandleRecording);
});
