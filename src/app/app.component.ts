import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Các biến để lưu trữ dữ liệu cảm biến
  sensorData = {
    temperature: 0,
    humidity: 0,
    fanSpeed: 0,
    ledState: 'OFF',
    buzzerState: 'OFF',
    temperatureWarning: 'Normal',
    humidityWarning: 'Normal'
  };

  // Các biến để lưu trữ mục tiêu điều khiển từ người dùng
  targetTemperature = 30; // Giá trị mặc định
  targetHumidity = 60;    // Giá trị mặc định
  mediumTemperature = 25; // Mức nhiệt độ trung bình
  mediumHumidity = 50;    // Mức độ ẩm trung bình
  fanSpeed = 0;           // Giá trị mặc định
  ledState = false;       // Giá trị mặc định
  buzzerState = false;    // Giá trị mặc định

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    // Nhận dữ liệu từ ESP32 qua WebSocket
    this.wsService.getMessages().subscribe((data: any) => {
      try {
        const jsonData = JSON.parse(data);
        this.sensorData.temperature = jsonData.temperature;
        this.sensorData.humidity = jsonData.humidity;
        this.sensorData.fanSpeed = jsonData.fanSpeed;
        this.sensorData.ledState = jsonData.ledState;
        this.sensorData.buzzerState = jsonData.buzzerState;
        this.sensorData.temperatureWarning = jsonData.temperatureWarning;
        this.sensorData.humidityWarning = jsonData.humidityWarning;
      } catch (e) {
        console.error('Error parsing WebSocket data', e);
      }
    });
  }

  // Gửi dữ liệu điều khiển quạt, LED và Buzzer tới ESP32
  updateControls() {
    const data = {
      targetTemperature: this.targetTemperature,
      targetHumidity: this.targetHumidity,
      mediumTemperature: this.mediumTemperature,  // Gửi giá trị nhiệt độ trung bình
      mediumHumidity: this.mediumHumidity,        // Gửi giá trị độ ẩm trung bình
      fanSpeed: this.fanSpeed,
      ledState: this.ledState ? 'on' : 'off',
      buzzerState: this.buzzerState ? 'on' : 'off'
    };

    this.wsService.sendMessage(JSON.stringify(data));
  }

  // Các hàm để thay đổi trạng thái của quạt, LED và Buzzer từ giao diện
  setFanSpeed(speed: number) {
    this.fanSpeed = speed;
    this.updateControls();
  }

  toggleLED() {
    this.ledState = !this.ledState;
    this.updateControls();
  }

  toggleBuzzer() {
    this.buzzerState = !this.buzzerState;
    this.updateControls();
  }
}
