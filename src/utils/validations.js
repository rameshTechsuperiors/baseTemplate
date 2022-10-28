const number = (value) => {
  return !isNaN(parseFloat(value));
};

const empty = (value) => {
  const val = value ? value.toString().trim() : value || value === 0;
  return !val;
};

const Validation = {
  empty,
  number,
};

export default Validation;
