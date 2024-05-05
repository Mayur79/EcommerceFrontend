import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetailStyles.css';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Initial details
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);

    // Get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    };

    // Get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <div className="product-container">
                <div className="product">
                    <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        className="product-image"
                        alt={product.name}
                    />
                </div>
                <div className="product-details">
                    <h1>Product Details</h1>
                    <hr />
                    <h6>Name: {product.name}</h6>
                    <h6>Description: {product.description}</h6>
                    <h6>
                        Price: {product?.price?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </h6>
                    <h6>Category: {product?.category?.name}</h6>
                    <button onClick={() => console.log("ADD TO CART")} className="add-to-cart-button">ADD TO CART</button>
                </div>
            </div>
            <hr />
            <div className="similar-products">
                <h4>Similar Products ➡️</h4>
                {relatedProducts.length < 1 && (
                    <p>No Similar Products found</p>
                )}
                <div>
                    {relatedProducts?.map((p) => (
                        <div className="similar-product" key={p._id}>
                            <img
                                src={`/api/v1/product/product-photo/${p._id}`}
                                className="product-image"
                                alt={p.name}
                            />
                            <div className="similar-product-details">
                                <div>
                                    <h5>{p.name}</h5>
                                    <h5>
                                        {p.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </h5>
                                </div>
                                <p>{p.description.substring(0, 60)}...</p>
                                <div>
                                    <button onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;
