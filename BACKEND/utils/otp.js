const otpcache = {};
let otpSpam={};
const otpExpiry=300;

function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpcache[email] = otp;
  setTimeout(() => {
    delete otpcache[email];
  }, otpExpiry*1000); // OTP expires after 5 minutes
  return otp;
}

function canRequestOTP(email) {
  const today = new Date().toISOString().split("T")[0];

  if (!otpSpam[email]) {
    otpSpam[email] = {
      count: 1,
      date: today,
    };
    console.log(otpSpam[email])
    return true;
  }
  
  if (otpSpam[email].date !== today) {
    otpSpam[email] = {
      count: 1,
      date: today,
    };
    console.log(otpSpam[email])
    return true;
  }

  if (otpSpam[email].count >= 3) {
    return false;
  }

  otpSpam[email].count++;
  return true;
}

module.exports = {
  generateOTP,
  canRequestOTP,
  otpcache,
  otpExpiry
};