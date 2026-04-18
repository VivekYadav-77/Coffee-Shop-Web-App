import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendEmailViaGAS = async (to, subject, body) => {
  const payload = {
    key: "wrongsecret",
    to: to,
    subject: subject,
    body: body,
  };

  try {
    const response = await axios({
      method: "post",
      url: process.env.GOOGLE_SCRIPT_URL.trim(),
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8", 
      },
      maxRedirects: 5,
    });
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

  } catch (error) {
    console.error("--- MAILER ERROR ---");
    console.error(error.message);
    if(error.response) {
      console.error(error.response.status, error.response.data);
    }
  }
};

sendEmailViaGAS("try.vivekyadav@gmail.com", "Test from script", "Hello world");
