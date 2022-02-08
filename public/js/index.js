const filter = async (cuisine, cost, Sort) => {
  try {
    // let querystr = `${cuisine}?${cost}?${sort}`;
    // querystr = querystr.split("?");
    let paramobj = {};
    if (cuisine) {
      paramobj.Cuisine = cuisine;
    }
    if (Sort) {
      paramobj.sort = Sort.toString();
    }
    if (!cost) {
      cost = "";
    } else {
      cost = `?${cost}`;
    }
    // querystr = querystr.replace(/,/g, "&");
    const data = await axios.post(`/location/:location/filter${cost}`, {
      params: paramobj,
    });
    console.log(data.data);
  } catch (err) {
    console.log(err);
  }
};

const filterbtn = document.querySelector("#btnfilter");
if (filterbtn) {
  filterbtn.addEventListener("click", (e) => {
    e.preventDefault();
    let cost = document.querySelector('input[name="cost"]:checked');
    const costparam = cost ? cost.value : "";
    let sort = document.querySelector('input[name="sort"]:checked');
    const sortparam = sort ? sort.value : "";
    console.log(costparam);
    console.log(sortparam);

    let cuisinecheckboxes = document.querySelectorAll(
      'input[name="Cuisine"]:checked'
    );
    let values = [];
    cuisinecheckboxes.forEach((checkbox) => {
      values.push(checkbox.value);
    });
    values = values.join(",");
    console.log(values, costparam, sortparam);
    filter(values, costparam, sortparam);
    if (sortparam) sort.checked = false;
    if (costparam) cost.checked = false;
    cuisinecheckboxes.checked = false;
  });
}
