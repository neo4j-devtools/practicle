const x = () => {
  return { ...{ x: "u" } };
};

console.log(x().x);
