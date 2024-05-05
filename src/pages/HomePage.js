import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { Button, Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { AiOutlineReload } from "react-icons/ai";
import "../styles/HomePage.css";
import "../styles/card.css";
import homimage from "../images/homimage.png";
const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    //get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    // get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    //getTotal count
    const getTotal = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/product-count');
            setTotal(data?.total);
        } catch (error) {
            console.log(error);

        }
    };
    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page])
    // load more
    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    // filter by category
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id)

        }
        else {
            all = all.filter(c => c !== id);
        }
        setChecked(all);
    };
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterproduct();
    }, [checked, radio]);
    //get filter product
    const filterproduct = async () => {
        try {
            const { data } = await axios.post('/api/v1/product/product-filters', { checked, radio });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={"ALl Products - Best offers "}>
            {/* banner image */}
            <img
                src={homimage}
                className="banner-img"
                alt="bannerimage"
                height={500}
                width={1510}
                style={{
                    position: 'relative', top: '-50px',
                    marginLeft: "5px"
                }}
            />

            {/* banner image */}
            <div className="container-fluid row mt-3 home-page">
                <div className="col-md-3 filters">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c) => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => handleFilter(e.target.checked, c._id)}
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>
                    {/* price filter */}
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-danger"
                            onClick={() => window.location.reload()}
                        >
                            RESET FILTERS
                        </button>
                    </div>
                </div>
                <div className="col-md-9 ">
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (
                            <div className="container card m-4" key={p._id} style={{ backgroundImage: `url(/api/v1/product/product-photo/${p._id})`, backgroundSize: 'co', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>

                                <div class="overlay">
                                    <div class="items"></div>
                                    <div class="items head">
                                        <p>{p.name}</p>


                                    </div>
                                    <div class="items price">

                                        <p class="new"> {p.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                        </p>
                                        <p onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem(
                                                "cart",
                                                JSON.stringify([...cart, p])
                                            );
                                            toast.success("Item Added to cart");
                                        }}
                                        >

                                            Add to Cart
                                        </p>
                                        <p onClick={() => navigate(`/product/${p.slug}`)}
                                        >

                                            More Details
                                        </p>
                                    </div>

                                </div>
                            </div>))}
                    </div>
                    <div className="m-2 p-3">
                        {products && products.length < total && (
                            <button
                                className="btn loadmore"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}
                            >
                                {loading ? (
                                    "Loading ..."
                                ) : (
                                    <>
                                        {" "}
                                        Loadmore <AiOutlineReload />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;