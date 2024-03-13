import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const { isAuthorized } = useContext(Context);

    const [categories, setCategories] = useState("all cat");
    const [searchTerm, setSearchTerm] = useState('');
    const navigateTo = useNavigate();

    useEffect(() => {
        try {
            axios
                .get("http://localhost:4000/api/v1/job/getall", {
                    withCredentials: true,
                })
                .then((res) => {
                    setJobs(res.data);
                });
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        if (!isAuthorized) {
            navigateTo("/");
        }
    }, [isAuthorized, navigateTo]);

    const filteredJobs = jobs.jobs && jobs.jobs.filter(element => {
        if (categories !== "all cat" && element.category !== categories) {
            return false;
        }
        if (searchTerm && !element.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <>

            <section className="jobs page">
                <div className="wrap">
                    <div className='search'>
                        <input
                            type='text'
                            placeholder='Search...'

                            value={searchTerm}
                            style={{ width: "300px", height: "6vh" }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button style={{ height: "6vh", margin: "2px", width: "50px" }}>
                            <FaSearch className='' />
                        </button>
                    </div >
                </div>
                <div className="container">
                    <h1>ALL AVAILABLE JOBS</h1>
                    <div className="banner">
                        {filteredJobs && filteredJobs.map((element) => (
                            <div className="card" key={element._id}>
                                <p>{element.title}</p>
                                <p>{element.category}</p>
                                <p>{element.country}</p>
                                <Link to={`/job/${element._id}`}>Job Details</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Jobs;
