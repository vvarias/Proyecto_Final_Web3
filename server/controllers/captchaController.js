// server/controllers/captchaController.js
import svgCaptcha from 'svg-captcha';

export const getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    ignoreChars: '0oO1iIl',
    color: true
  });
  req.session.captcha = captcha.text;
  res.type('svg');
  res.status(200).send(captcha.data);
};