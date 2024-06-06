import { rProjectLogo, rProjectName, rProjectURL } from "./tamplateConstants";

export const newResutaurantUserAccount = (
  email: string,
  password: string,
  name: string
) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${rProjectName} MEMBER</title>
        <style>
    /* Reset default styles */
    body, p {
      margin: 0;
      padding: 0;
    }
    /* Container */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    /* Header */
    .header {
      background-color: #f4f4f4;
      padding: 20px;
      text-align: center;
    }
    /* Content */
    .content {
      padding: 20px;
      border: 1px solid #ccc;
    }
    /* Button */
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
      .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      text-align: center;
    }
  </style>
    </head>
    <body
      style="
        font-family: Helvetica, Arial, sans-serif;
        margin: 0px;
        padding: 0px;
        background-color: #ffffff;
      "
    >
      <div class="container">
    <div class="header">
      <h1>Welcome to Restaurant Platform!</h1>
    </div>
    <div class="content">
      <p>Assalamu'Alaikum ar RahmatUllahi Obarakat!,</p>
      <br/>
      <p>
Respected dear <strong>${name},</strong><p> 
      <br/>
        Welcome to the web world of Restaurant! Your Restaurant account has been created successfully.</p>
        <br/>
        <p><strong>Web Link: </strong> <a href="https://www.restaurant.hotel360.world/" target="_blank">https://www.restaurant.hotel360.world/</a></p> <br/>
      <p>You can now access your account using the following credentials:</p>
      <p><strong>Email: </strong>${email}</p>
      <p><strong>Password: </strong> ${password}</p>
      <br/>
      <p>Please login your account by clicking the above login link and change your password immediately. Enjoy your account with Restaurant360 and let the world know about your business.</p>
      <br/>
      <p>Warning : Please don't share your password or OTP to anyone!</p>
      <p>For any Query and Question, please call Tell: +8809638336699 or</p>
      <p>email: info@m360ict.com</p>
      <br/>
 
      <br/>
      <div style="text-align: left">
                        <div style="padding-bottom: 20px">
                      
                        </div>
                      </div>
                      <div
                        style="
                          padding-top: 20px;
                          color: rgb(153, 153, 153);
                          text-align: center;
                        "
                      >
                        <a href="${rProjectURL}" style="padding-bottom: 16px; text-decoration: none; font-weight: bold;">https://www.m360ict.org<a/>
                      </div>
      <p>Best regards,</p>
      <p>M360ICT</p>
  </div>
  <div>                  
    <div>
        <a href="https://trabill.app" style="display:flex; color:black; text-decoration:none; align-items:center; gap:10px">
          <img
                          src="https://trabill.app/assets/img/logo/logo.png"
                          alt="Trabill Logo"
                          style="width: 100px; height:50px;"
                        />
                    <div>
                    <p>Trabill is the best software for your Travel Agency Business.</p>
                    <p style="margin-top:5px; margin-bottom:5px; color:blue; font-weight:bold;">Click here to see the software demo.</p>
                    <b>Call: +8809638336699 </b>
                    </div>
                    <a/>
    </div>
  </div>
    </body>
  </html>
  `;
};
