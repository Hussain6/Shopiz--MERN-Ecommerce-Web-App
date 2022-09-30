import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom'
import Message from '../components/Message';
import axios from 'axios';
import Loader from '../components/Loader';
import { getOrderDetials, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';
const OrderScreen = () => {

    const dispatch = useDispatch()
    const params = useParams();
    const navigate = useNavigate()
    const orderId = params.id

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails


    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { success: successDeliver, loading: loadingDeliver } = orderDeliver


    if (!loading) {
        const addDeciamls = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        }

        //Calculate Prices
        order.itemsPrice = addDeciamls(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('http://localhost:5000/api/config/paypal')
            console.log(clientId)
        }
        addPayPalScript();
        if (!order || successDeliver) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetials(orderId))
        }

    }, [orderId, dispatch, successDeliver, order, navigate, userInfo])
    const successPaymentHandler = (paymentResult) => {
        paymentResult = {
            id: " 1FG51696RX93031sxsx03sdfsdfa ",
            status: "COMPLETED",
            update_time: "2022-15-09",
            payer: {
                email_address: "ok@gmail.com"
            }
        }
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }

    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p><strong>Name: </strong>{order.user.name}</p>
                        <p><strong>Email: </strong>
                            <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p>
                            <strong>Address:</strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                            {order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? <Message variant='success'> Delivered on {order.deliveredAt}</Message> : <Message variant='danger'> Not Delivered</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant='success'> Paid on {order.paidAt}</Message> : <Message variant='danger'> Not Paid</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {order.orderItems.length === 0 ? (
                            <Message>Order is empty</Message>
                        ) : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fluid
                                                    rounded
                                                />
                                            </Col>
                                            <Col>
                                                <Link to={`/product/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={4}>
                                                {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summary</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (<ListGroup.Item>
                            <Button onClick={successPaymentHandler}>Pay Bill</Button>
                        </ListGroup.Item>)}
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button typr="button" className="btn btn-block" onClick={deliverHandler}>Mark As Delivered</Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
}
export default OrderScreen