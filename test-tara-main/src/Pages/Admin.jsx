import Axios from "axios";
import React from "react";
import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { faker } from '@faker-js/faker';

ChartJS.register(
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
)

const AdminLogin = () => {
    const [userData, setUserData] = React.useState([])
    const [deptName, setDeptName] = React.useState([])
    const [docCountByDept, setdocCountByDept] = React.useState([])
    const [unqDept, setUnqDept] = React.useState(new Set());

    const getUserData = () => {
        Axios.get('https://api.si-tara.com/getUserDocCount')
            .then(res => {
                setUserData(res.data)
                console.log(res.data)
            })
    }

    const getUserCountByDept = () => {
        Axios.get('https://api.si-tara.com/getUserCountByDept')
            .then(res => {
                setUnqDept(new Set(res.data.deptName))
                setdocCountByDept(res.data.docCount)
                console.log("doc",res.data.deptName)
                console.log(res.data.docCount)
            })
    }

    const labels = ['MS/ECL6', 'February', 'March', 'April', 'May', 'June', 'July'];

    
    // console.log(unqDept)

    const Bardata = {
        labels: [...unqDept],
        // labels,
        datasets: [
            {
                label: 'Docs Generated',
                data: docCountByDept,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            // {
            //   label: 'Dataset 2',
            //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
            // },
        ],
    };

    const Linedata = {
        labels: userData.map(({ email }) => email),
        datasets: [
            {
                fill: true,
                label: 'Docs Generated',
                data: userData.map(({ docCount }) => docCount),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            // {
            //   label: 'Dataset 2',
            //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
            //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
            // },
        ],
    };

    const pieData = {
        labels: userData.map(({ email }) => email),
        datasets: [
            {
                label: "no of docs",
                data: userData.map(({ docCount }) => docCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }
        ]
    }

    return (
        <>
            <button onClick={() => { getUserData() }}>
                click me
            </button>
            <button onClick={() => { getUserCountByDept() }}>
                docbydept
            </button>
            {/* <table>
                <thead>
                    <tr>
                        <th>
                            Emails
                        </th>
                        <th>
                            count
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {userData.map(({ email, docCount }, index) => (
                        <tr key={index}>
                            <td>{email}</td>
                            <td>{docCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
            {/* {getUserDocCount()} */}
            {/* <p>{userEmail + "" + userDocCount + ""}</p> */}
            <div style={{ height: '1080px', width: '1080px' }}>
                <Bar data={Bardata} />
            </div>
            <div style={{ height: '1080px', width: '1080px' }}>
                <Pie data={pieData} />
            </div>
            <div style={{ height: '1080px', width: '1080px' }}>
                <Line data={Linedata} />
            </div>
        </>
    )
}

export default AdminLogin;

