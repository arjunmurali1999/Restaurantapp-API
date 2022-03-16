class APIfeatures {
  constructor(query, queryString) {  //http:localhost:3000/restaurant?Cuisine=NorthIndian?Sort=1
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A)FILTERING
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludedField = ["page", "sort", "limit", "fields"];
    excludedField.forEach((el) => delete queryObj[el]);

    // 2B)ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  filterarray() {
    const queryObj = { ...this.queryString }; //this.queryString gets the value of all the query parameters
    const excludedField = ["page", "sort", "limit", "fields"];
    excludedField.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);
    let value = Object.values(queryStr);
    let query = {};
    if (queryStr.cost) {
      query.cost = queryStr.cost;
      value = value[1].toString().split(",");
    } else {
      value = value[0].toString().split(",");
    }
    value = value.map((Cuisine) => ({ "Cuisine.name": Cuisine }));
    let Cuisine
    let Cost
    if (query.cost) {
      value[value.length] = query;
      Cuisine= value.filter((val)=>{
        return !val.cost
      })
      Cost=value.filter((val)=>{
        return val.cost
      })
    }
    value.map((query) => {
      if (query.cost) {
        this.query = this.query.find({ $and:[{$or:Cuisine},Cost[0]]});
        return this;
      }
    });
    this.query = this.query.find({ $or: value });
    return this;
  }
  sort() {
    // 2)SORT
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort();
    }
    return this;
  }

  limitFields() {
    // 3)FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //  4)PAGINATION
    const page = this.queryString.page * 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10 page-1,10-20 page-2
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIfeatures;
