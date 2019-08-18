//Здесь можно настроить аксиос для проекта

import axios from 'axios';

axios.defaults.withCredentials = true;   /*Позволяет получать куки*/

axios.defaults.headers = {
    'Accept': 'application/json',
    // 'X-CSRFTOKEN': 'hM8ptflkbQyfqkTObRJswyWsFaCGhslY88fadfCm2qH1NLtNHpv2LZDj4UIuAIHZ'
};

if (process.env.NODE_ENV === 'production') axios.defaults.baseURL = '/api/v1/';
else if (process.env.NODE_ENV === 'development') axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1/';


