const sendOTPEmail = async (email, otp, fullName) => {
    try {
        if (!email || !otp) {
            return {
                success: false,
                message: "Missing required parameters (email or OTP)",
                status: 400
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                message: "Invalid email format",
                status: 400
            };
        }

        const emailData = {
            sender: {
                name: "Clean Bubble",
                email: process.env.EMAIL_SENDER_EMAIL
            },
            to: [{
                email: email,
                name: fullName || "User"
            }],
            subject: "Password Reset OTP - Clean Bubble",
            htmlContent: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset OTP</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000; color: #ffffff;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background-color: #111111; border-radius: 10px; padding: 40px; border: 1px solid #333333;">
                            <!-- Header -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold;">
                                    Password Reset Request
                                </h1>
                                <div style="width: 50px; height: 3px; background-color: #ff6b6b; margin: 15px auto;"></div>
                            </div>
                            
                            <!-- Greeting -->
                            <div style="margin-bottom: 30px;">
                                <p style="color: #ffffff; font-size: 18px; margin: 0;">
                                    Hello ${fullName || "User"},
                                </p>
                            </div>
                            
                            <!-- Main Content -->
                            <div style="margin-bottom: 30px;">
                                <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    We received a request to reset your password. Please use the OTP below to proceed with your password reset:
                                </p>
                                
                                <!-- OTP Display -->
                                <div style="text-align: center; margin: 30px 0;">
                                    <div style="background-color: #222222; border: 2px solid #ff6b6b; border-radius: 8px; padding: 20px; display: inline-block;">
                                        <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">
                                            Your OTP Code
                                        </p>
                                        <p style="color: #ff6b6b; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </p>
                                    </div>
                                </div>
                                
                                <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                    This OTP is valid for <strong style="color: #ff6b6b;">10 minutes</strong>. Please do not share this code with anyone.
                                </p>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background-color: #1a1a1a; border-left: 4px solid #ffa500; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #ffa500; font-size: 14px; margin: 0 0 5px 0; font-weight: bold;">
                                    🔒 Security Notice
                                </p>
                                <p style="color: #cccccc; font-size: 14px; margin: 0; line-height: 1.4;">
                                    If you didn't request this password reset, please ignore this email. Your account remains secure.
                                </p>
                            </div>
                            
                            <!-- Footer -->
                            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #333333;">
                                <p style="color: #666666; font-size: 14px; margin: 0;">
                                    This is an automated message, please do not reply to this email.
                                </p>
                                <p style="color: #666666; font-size: 14px; margin: 10px 0 0 0;">
                                    © ${new Date().getFullYear()} Clean Bubble. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const response = await fetch(process.env.EMAIL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.EMAIL_API_KEY
            },
            body: JSON.stringify(emailData)
        });


        if (!response.ok) {
            const errorText = await response.text();
            const statusCode = response.status;

            console.error('Email sending error:', {
                status: statusCode,
                error: errorText
            });


            if (statusCode === 401) {
                return {
                    success: false,
                    message: "Email service authentication failed",
                    status: 401
                };
            } else if (statusCode === 429) {
                return {
                    success: false,
                    message: "Rate limit exceeded. Please try again later.",
                    status: 429
                };
            } else if (statusCode === 400) {
                return {
                    success: false,
                    message: "Invalid email request. Please check the email address.",
                    status: 400
                };
            }

            return {
                success: false,
                message: "Failed to send email. Please try again.",
                status: statusCode
            };
        }


        const responseData = await response.json();

        // console.log('Email sent successfully:', {
        //     messageId: responseData.messageId,
        //     to: email
        // });

        return {
            success: true,
            message: "OTP email sent successfully",
            messageId: responseData.messageId,
            status: 200
        };

    } catch (error) {
        console.error('Email sending error:', error);

        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return {
                success: false,
                message: "Network error. Please check your internet connection.",
                status: 500
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred while sending email",
            error: error.message,
            status: 500
        };
    }
};

module.exports = {
    sendOTPEmail
};
