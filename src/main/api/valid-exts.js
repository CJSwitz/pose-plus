const VALID_EXTS = [ '.jpg', '.jpeg', '.png', '.svg', '.gif', '.ico', '.bmp', '.webp' ];

function validate(ext) {
  return VALID_EXTS.includes(ext.toLowerCase());
}

module.exports = validate;
