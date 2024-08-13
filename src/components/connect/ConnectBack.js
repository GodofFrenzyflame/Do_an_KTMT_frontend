// src/components/mqtt/MqttClient.js

const MQTT_URL = 'wss://620d3e323e674597903f79e9af23c88d.s1.eu.hivemq.cloud:8884/mqtt';

// Khởi tạo WebSocket với URL của broker MQTT
const webSocket = new WebSocket(MQTT_URL);

// Xử lý sự kiện khi kết nối thành công
webSocket.onopen = () => {
  console.log('WebSocket connection established');
  
  // Gửi yêu cầu subscribe để theo dõi các topic (nếu cần)
  const subscribeMessageTemperature = JSON.stringify({
    type: 'subscribe',
    topic: 'sensor/temperature'
  });
  webSocket.send(subscribeMessageTemperature);

  const subscribeMessageHumidity = JSON.stringify({
    type: 'subscribe',
    topic: 'sensor/humidity'
  });
  webSocket.send(subscribeMessageHumidity);
};

// Xử lý dữ liệu nhận được từ WebSocket
webSocket.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    console.log('Message received:', message);

    // Xử lý dữ liệu dựa trên các topic và loại dữ liệu
    // Ví dụ: { topic: 'sensor/temperature', payload: '25.5' }
    if (message.topic === 'sensor/temperature' || message.topic === 'sensor/humidity') {
      const data = {
        topic: message.topic,
        payload: parseFloat(message.payload),
        timestamp: new Date().toLocaleTimeString(),
      };

      // Gửi dữ liệu qua WebSocket
      if (window.websocketDataCallback) {
        window.websocketDataCallback(data);
      }
    }
  } catch (error) {
    console.error('Error parsing message:', error);
  }
};

// Xử lý lỗi kết nối
webSocket.onerror = (error) => {
  console.error('WebSocket Error:', error);
};

// Xử lý khi kết nối bị đóng
webSocket.onclose = () => {
  console.log('WebSocket connection closed');
};

// Export WebSocket để sử dụng trong các component khác
export default webSocket;
