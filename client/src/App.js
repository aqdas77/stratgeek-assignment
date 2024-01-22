import * as React from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const defaultData = [
    {
      owner: "aqdas77",
      author: "aqdas053",
      line_changed: 23,
      pr_merged: 2,
      total_pr: 2,
      reviews_done: 1,
      file_changed_stats: 1,
    },
    {
      owner: "aqdas77",
      author: "mdz65",
      line_changed: 30,
      pr_merged: 2,
      total_pr: 3,
      reviews_done: 2,
      file_changed_stats: 3,
    },
    {
      owner: "aqdas77",
      author: "mda",
      line_changed: 20,
      pr_merged: 1,
      total_pr: 2,
      reviews_done: 3,
      file_changed_stats: 3,
    },
  ]
  const [usersData, setUsersData] = useState(defaultData);
  var id=0
  const fetchUsersData = async () => {
    try {
      const url = "http://localhost:5000/api/get-data";

      const res = await axios.post(url, {
        username: "aqdas77",
        repo: "News-Express",
      });

      if (res.status === 200) {
        setUsersData(res.data);
      } else {
        console.log("Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchUsersData();
  }, []);
  const pr_creation_data = [];
  const pr_review_data = [];
  usersData.forEach((item)=>{
    pr_creation_data.push({id:id,value:item.total_pr,label:item.author})
    id=id+1;
  })
  id=0;
  usersData.forEach((item)=>{
    pr_review_data.push({id:id,value:item.reviews_done,label:item.author})
    id=id+1;
  })
  const PR_CREATION_TOTAL = pr_creation_data.map((item) => item.value).reduce((a, b) => a + b, 0);
  const PR_REVIEW_TOTAL = pr_review_data.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel1 = (params) => {
    const percent = params.value / PR_CREATION_TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };
  const getArcLabel2 = (params) => {
    const percent = params.value / PR_REVIEW_TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{backgroundColor:"teal"}}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Github Stats
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        margin={5}
        sx={{
          backgroundColor: "#f3faf8",
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          p: 1,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, pt: 2, px: 2 }}
        >
          Individual Code Contributions
        </Typography>

        {/* table */}
        <div>
          <Sheet
            sx={{
              "--TableCell-height": "40px",
              "--TableHeader-height": "calc(1 * var(--TableCell-height))",
              height: 200,
              margin: 2,
              overflow: "auto",
              background: (theme) =>
                `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 50% 0,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 50% 100%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
              backgroundSize: "100% 40px, 100% 40px, 100% 14px, 100% 14px",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "local, local, scroll, scroll",
              backgroundPosition:
                "0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%",
              backgroundColor: "background.surface",
              borderRadius: "8px",
            }}
          >
            <Table stickyHeader>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#E5E4E2" }}>Team</th>
                  <th style={{ backgroundColor: "#E5E4E2" }}>
                    No. of Line Contributions
                  </th>
                  <th style={{ backgroundColor: "#E5E4E2" }}>
                    No. of File Contributions
                  </th>
                  <th style={{ backgroundColor: "#E5E4E2" }}>PRs merged</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((data) => (
                  <tr key={data.name}>
                    <td>{data.author}</td>
                    <td>{data.line_changed}</td>
                    <td>{data.file_changed_stats}</td>
                    <td>{data.pr_merged}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        </div>
      </Box>
      <Box
        margin={5}
        sx={{
          backgroundColor: "#f3faf8",
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          p: 1,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, pt: 2, px: 2 }}
        >
          PR Creation Breakdown
        </Typography>

        <Container sx={{ py: 2, px: 2 }}>
          <Container sx={{ py: 2, px: 2 }}>
            <PieChart
              series={[
                {
                  data:pr_creation_data,
                  arcLabel: getArcLabel1,
                  highlightScope: { faded: "global", highlighted: "item" },
                  innerRadius: 30,
                  outerRadius: 100,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontSize: 14,
                },
              }}
              height={200}
            />
          </Container>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography component="div" sx={{ px: 2, fontStyle: "italic" }}>
              *Above percentages illustrate each person's contribution to PR
              creation.
            </Typography>
          </Container>
        </Container>
      </Box>
      <Box
        margin={5}
        sx={{
          backgroundColor: "#f3faf8",
          boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "15px",
          p: 1,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, pt: 2, px: 2 }}
        >
          PR Review Breakdown
        </Typography>

        <Container sx={{ py: 2, px: 2 }}>
          <Container sx={{ py: 2, px: 2 }}>
            <PieChart
              series={[
                {
                  data:pr_review_data,
                  arcLabel: getArcLabel2,
                  highlightScope: { faded: "global", highlighted: "item" },
                  innerRadius: 30,
                  outerRadius: 100,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontSize: 14,
                },
              }}
              height={200}
            />
          </Container>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography component="div" sx={{ px: 2, fontStyle: "italic" }}>
              *Above percentages illustrate each person's contribution to PR
              Reviews.
            </Typography>
          </Container>
        </Container>
      </Box>
    </div>
  );
}

export default App;
