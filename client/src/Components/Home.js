import React, { useState, useEffect } from "react"; // Importing necessary modules from React
import Select from "react-select"; // Importing Select component from react-select library
import axios from "axios"; // Importing axios for making HTTP requests
import { Bar, Pie } from "react-chartjs-2"; // Importing Bar and Pie components from react-chartjs-2 library
import Chartjs from "chart.js/auto"; // Importing Chartjs library
import "./Home.css"; // Importing CSS file for styling

function Home() {
  // Defining the functional component named Home
  const [data, setData] = useState([]); // Declaring state variable 'data' using useState hook
  const [selectedMonths, setSelectedMonths] = useState({
    // Declaring state variable 'selectedMonths' with initial value
    value: 3,
    label: "March",
  });
  const [filteredData, setfilteredData] = useState([]); // Declaring state variable 'filteredData' using useState hook
  const [searchTransactions, setSearchTransaction] = useState(""); // Declaring state variable 'searchTransactions' with initial value
  const [totalSale, setTotalSale] = useState(null); // Declaring state variable 'totalSale' with initial value
  const [totalSold, setTotalSold] = useState(null); // Declaring state variable 'totalSold' with initial value
  const [totalNotSold, setTotalNotSold] = useState(null); // Declaring state variable 'totalNotSold' with initial value
  const [pieChartData, setPieChartData] = useState([]); // Declaring state variable 'pieChartData' using useState hook
  const [transactionsPerPage, setTransactionsPerPage] = useState(10); // Declaring state variable 'transactionsPerPage' with initial value

  const months = [
    // Array containing month objects
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const SalesPerMonths = () => {
    // Function to calculate sales per month
    const soldTransactions = filteredData.filter((item) => item.sold === true); // Filtering sold transactions
    const totalSaleSum = soldTransactions.reduce(
      // Calculating total sale
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
    );
    setTotalSale(totalSaleSum); // Updating total sale state
    setTotalSold(soldTransactions.length); // Updating total sold state
    setTotalNotSold(filteredData.length - soldTransactions.length); // Updating total not sold state
  };

  useEffect(() => {
    // Effect hook to fetch data from server when selectedMonths changes
    axios
      .post("http://localhost:4001/getData", { months: selectedMonths.value }) // Making HTTP POST request
      .then((response) => {
        setData(response.data); // Setting fetched data into state
      })
      .catch((err) => {
        console.log("Error fetching data from server ,", err); // Logging error if request fails
      });
  }, [selectedMonths]); // Dependency array

  useEffect(() => {
    // Effect hook to update filteredData when data changes
    setfilteredData(data); // Updating filteredData with fetched data
  }, [data]); // Dependency array

  const ChangeMonth = (selectedOption) => {
    // Function to handle change in selected month
    setSelectedMonths(selectedOption); // Updating selectedMonths state
  };

  useEffect(() => {
    // Effect hook to recalculate sales per month when filteredData or SalesPerMonths function changes
    SalesPerMonths(); // Recalculating sales per month
  }, [filteredData, SalesPerMonths]); // Dependency array

  useEffect(() => {
    // Effect hook to filter data based on searchTransactions
    let lowerSearch = searchTransactions.toLowerCase(); // Converting search input to lowercase
    setfilteredData(
      // Filtering data based on search input
      data.filter((item) => {
        const lowerPrice = String(item.price).toLowerCase(); // Converting price to lowercase string
        return (
          item.title.toLowerCase().includes(lowerSearch) || // Checking if title includes search input
          item.description.toLowerCase().includes(lowerSearch) || // Checking if description includes search input
          lowerPrice.includes(lowerSearch) // Checking if price includes search input
        );
      })
    );
  }, [searchTransactions, data]); // Dependency array


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  const generateBarChartData = () => {
    // Function to generate data for bar chart
    // Define price ranges including "900 and above"
    let priceRanges = [
      0,
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      Number.POSITIVE_INFINITY,
    ];
    let priceCount = Array(priceRanges.length - 1).fill(0); // Initializing price count array

    filteredData.forEach((item) => {
      // Iterating through filtered data
      const price = item.price; // Getting price of each item
      for (let i = 0; i < priceRanges.length - 1; i++) {
        // Looping through price ranges
        if (price >= priceRanges[i] && price < priceRanges[i + 1]) {
          // Checking if price falls within current range
          priceCount[i]++; // Incrementing count for current range
          break;
        }
      }
    });

    // Adjust labels to show the desired ranges
    let labels = priceRanges
      .slice(0, priceRanges.length - 1)
      .map((range, index) => {
        if (index === priceRanges.length - 2) {
          return `${range + 1}-${priceRanges[index + 1]} and above`;
        } else {
          return `${range + 1}-${priceRanges[index + 1]}`;
        }
      });

    return {
      // Returning data for bar chart
      labels: labels, // Labels for bar chart
      datasets: [
        {
          label: "Number of Items",
          data: priceCount, // Data for bar chart
          backgroundColor: "rgba(0, 50, 116, 0.603)", // Background color for bars
        },
      ],
    };
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const pieChartGenerator = () => {
    // Function to generate data for pie chart
    // Count occurrences of each category
    let categoryCounts = {};
    filteredData.forEach((item) => {
      const category = item.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Convert counts intoan array of objects
    let result = Object.keys(categoryCounts).map((category) => {
      return { category: category, count: categoryCounts[category] };
    });

    console.log(result); // Output the array of objects

    // Sample data for the pie chart
    return {
      labels: result.map((obj) => obj.category),
      datasets: [
        {
          label: result.map((obj) => obj.category),
          data: result.map((obj) => obj.count),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

  };
///////////////////////////////////////////////////////////////////////////////////
  return (
    // Returning JSX for rendering
    <>
      <div className="container ">
        <div className="row justify-content-center align-item-center header py-2">
          <div className="col col-1 ">
            {" "}
            <h6> Transaction </h6> <h6> Dashboard</h6>
          </div>
        </div>
        <div className="row justify-content-evenly align-items-center p-5">
          <div className="col col-3">
            <form className="" role="search">
              <input
                className="form-control mx-auto bg-warning-subtle border border-2 border-warning"
                onChange={(e) => {
                  setSearchTransaction(e.target.value);
                }}
                type="search"
                placeholder="Search Transactions"
                aria-label="Search"
              />
            </form>
          </div>
          <div className="col col-3">
            {" "}
            <Select
              defaultValue={[months[2]]}
              onChange={ChangeMonth}
              name="Months"
              options={months}
              className="basic-single-select"
              classNamePrefix="select"
            />
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="col col-12 table-col bg-warning-subtle pt-2">
            <table className="table table-warning">
              <thead>
                <tr>
                  <th scope="col">id</th>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                  <th scope="col">Price</th>
                  <th scope="col">Category</th>
                  <th scope="col">Sold</th>
                  <th scope="col">Image</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(
                  (
                    item,
                    index // Mapping through filteredData to render table rows
                  ) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.price}</td>
                      <td>{item.category}</td>
                      <td>{item.sold ? "Yes" : "No"}</td>
                      <td>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ maxWidth: "100px" }}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row justify-content-evenly align-items-center py-5">
          <div className="col col-4 ">
            <div class="card bg-warning-subtle border border-2 border-warning ">
              <div class="card-body">
                <h5 class="card-title text-center pb-3">
                  Statistics - <strong> {selectedMonths.label}</strong>
                </h5>
                <div class="card-text">
                  <div className="d-flex align-itms-center justify-content-between">
                    <h6 className=" ">Total Sale</h6>
                    <h6 className="">{totalSale}</h6>
                  </div>
                  <div className="d-flex align-itms-center justify-content-between">
                    <h6 className=" ">Total Sold</h6>
                    <h6 className="">{totalSold}</h6>
                  </div>
                  <div className="d-flex align-itms-center justify-content-between">
                    <h6 className=" ">Total not Sold</h6>
                    <h6 className="">{totalNotSold}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col col-3">
            <Pie data={pieChartGenerator()} />
            {/*Rendering Pie chart with data generated from pieChartGenerator function*/}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h2>Price Range Distribution</h2>
            <Bar data={generateBarChartData()} />
            {/*Rendering Bar chart with data generated from generateBarChartData function*/}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home; // Exporting Home component
