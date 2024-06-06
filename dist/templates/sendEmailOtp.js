"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailOtpTemplate = void 0;
const tamplateConstants_1 = require("./tamplateConstants");
const sendEmailOtpTemplate = (otp, otpFor) => {
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${tamplateConstants_1.projectName} OTP FOR VERIFY</title>
    </head>
    <body
      style="
        font-family: Helvetica, Arial, sans-serif;
        margin: 0px;
        padding: 0px;
        background-color: #ffffff;
      "
    >
      <table
        role="presentation"
        style="
          width: 100%;
          border-collapse: collapse;
          border: 0px;
          border-spacing: 0px;
          font-family: Arial, Helvetica, sans-serif;
          background-color: rgb(239, 239, 239);
        "
      >
        <tbody>
          <tr>
            <td
              align="center"
              style="padding: 1rem 2rem; vertical-align: top; width: 100%"
            >
              <table
                role="presentation"
                style="
                  max-width: 600px;
                  border-collapse: collapse;
                  border: 0px;
                  border-spacing: 0px;
                  text-align: left;
                "
              >
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px">
                      <div style="text-align: left">
                        <div style="padding-bottom: 20px">
                          <img
                            src="${tamplateConstants_1.projectLogo}"
                            alt="${tamplateConstants_1.projectName}"
                            style="width: 100px"
                          />
                        </div>
                      </div>
                      <div
                        style="
                          padding: 20px;
                          background-color: rgb(255, 255, 255);
                        "
                      >
                        <div style="color: rgb(0, 0, 0); text-align: left">
                          <h1 style="margin: 1rem 0">Verification code</h1>
                          <p style="padding-bottom: 16px">
                            Please use the verification code below to ${otpFor}.
                          </p>
                          <p style="padding-bottom: 16px">
                            <strong style="font-size: 130%">${otp}</strong>
                          </p>
                          <p style="padding-bottom: 16px">
                            Validity for OTP is 3 minutes
                          </p>
                          <p style="padding-bottom: 16px">
                            Thanks,<br />
                            <b
                              >${tamplateConstants_1.projectName}</b
                            >
                          </p>
                        </div>
                      </div>
                      <div
                        style="
                          padding-top: 20px;
                          color: rgb(153, 153, 153);
                          text-align: center;
                        "
                      >
                        <a href="${tamplateConstants_1.projectURL}" style="padding-bottom: 16px; text-decoration: none; font-weight: bold;">${tamplateConstants_1.projectURL}<a/>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;
};
exports.sendEmailOtpTemplate = sendEmailOtpTemplate;
//# sourceMappingURL=sendEmailOtp.js.map