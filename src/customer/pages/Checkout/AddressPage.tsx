import React, { useRef, useState } from 'react'
import PricingCard from '../Cart/PricingCard'
import { Box, Modal } from '@mui/material'
import AddressForm from './AddresssForm'
import AddressCard from './AddressCard'
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { Radio, RadioGroup } from '@mui/material'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 480,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

const paymentGatwayList = [
    {
        value: "RAZORPAY",
        image: "https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png",
        label: "Razorpay"
    }
];

const AddressPage = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(store => store);
    const { loading: orderLoading } = useAppSelector(store => store.orders);
    const [paymentGateway, setPaymentGateway] = useState(paymentGatwayList[0].value);
    const [open, setOpen] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const inFlightRef = useRef(false);

    // Shared helper to place the order once and redirect.
    // Guards against double-submit (clicks + StrictMode) and keeps navigation in the UI layer.
    const dispatchOrder = async (address: any) => {
        if (inFlightRef.current || orderLoading || placingOrder) return;
        inFlightRef.current = true;
        setPlacingOrder(true);
        try {
            setOrderError(null);
            // FIX 2: .unwrap() re-throws any rejectWithValue error as an exception,
            // giving us a reliable try/catch. Without .unwrap(), a rejected thunk
            // looks like a resolved promise and errors are silently swallowed.
            const result = await dispatch(createOrder({
                paymentGateway,
                address,
                jwt: localStorage.getItem('jwt') || '',
            })).unwrap();

            // Redirect to payment gateway from the UI layer for full control.
            if (result?.payment_link_url) {
                window.location.href = result.payment_link_url;
            } else {
                // payment_link_url was missing in the response — log clearly
                // so it's obvious the backend isn't returning the expected field.
                console.error(
                    '[AddressPage] createOrder succeeded but payment_link_url is missing.',
                    'Full response:', result,
                    '\nCheck your backend — the order was created but the user',
                    'cannot be redirected to payment without this field.'
                );
                setOrderError('Payment gateway URL not received. Please contact support.');
            }
        } catch (error: any) {
            // error here is the rejectWithValue payload (a string)
            console.error('[AddressPage] createOrder failed:', error);
            setOrderError(`Order failed: ${error}`);
        } finally {
            setPlacingOrder(false);
            inFlightRef.current = false;
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Called when user picks an existing saved address and clicks Place Order
    const handleCreateOrder = () => {
        if (orderLoading || placingOrder) return;
        const addresses = user.user?.addresses ?? [];
        if (addresses.length === 0) return;
        dispatchOrder(addresses[selectedIndex]);
    };

    // Called by AddressForm when a new address is submitted
    // FIX 4: Previously this called dispatch directly without await, AND it
    // was also calling handleClose() which cleared pendingAddress before
    // the async order could be placed. Now it awaits inside dispatchOrder.
    const handleAddressSaved = (address: any) => {
        setOpen(false);
        dispatchOrder(address);
    };

    const handleChange = (event: any) => {
        setSelectedIndex(Number(event.target.value));
    };

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentGateway(event.target.value);
    };

    const addresses = user.user?.addresses ?? [];
    const isProcessing = orderLoading || placingOrder;

    return (
        <div className='min-h-screen bg-[#f5f6f8]'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12'>

            {/* Step indicator */}
            <div className='flex items-center gap-2 text-sm text-gray-500 mb-5'>
                <span className='text-[#0b7285] font-semibold'>Cart</span>
                <span>›</span>
                <span className='font-bold text-gray-900'>Delivery Address</span>
                <span>›</span>
                <span>Payment</span>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 items-start'>

                {/* ── Left: Address selection ── */}
                <div className='lg:col-span-2 space-y-4'>
                    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>

                        {/* Section header */}
                        <div className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-[#f2f4f7]'>
                            <div className='flex items-center gap-2'>
                                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#0b7285' }} />
                                <span className='font-bold text-sm text-gray-900'>Choose a Delivery Address</span>
                            </div>
                            <button
                                onClick={handleOpen}
                                className='text-xs font-semibold text-[#0b7285] hover:underline flex items-center gap-1'
                            >
                                <AddIcon sx={{ fontSize: 15 }} />
                                Add new address
                            </button>
                        </div>

                        {/* Address list */}
                        {addresses.length > 0 ? (
                            <div className='divide-y divide-gray-100'>
                                {addresses.map((item, index) => (
                                    <AddressCard
                                        key={item.id}
                                        item={item}
                                        selectedValue={selectedIndex}
                                        value={index}
                                        handleChange={handleChange}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-12 text-center px-6'>
                                <LocationOnOutlinedIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                <p className='text-gray-600 font-medium'>No saved addresses</p>
                                <p className='text-sm text-gray-400 mt-1'>Add a delivery address to continue</p>
                            </div>
                        )}

                        {/* Add address row */}
                        <div className='border-t border-gray-100 px-5 py-3'>
                            <button
                                onClick={handleOpen}
                                className='flex items-center gap-2 text-sm text-[#0b7285] hover:underline font-semibold'
                            >
                                <AddIcon sx={{ fontSize: 17 }} />
                                Add a new delivery address
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Right: Payment + Summary ── */}
                <div className='col-span-1 space-y-4'>

                    {/* Payment Gateway */}
                    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
                        <div className='px-5 py-3 border-b border-gray-100 bg-[#f2f4f7]'>
                            <span className='text-sm font-bold text-gray-900'>Choose Payment Method</span>
                        </div>
                        <div className='px-5 py-4'>
                            <RadioGroup
                                value={paymentGateway}
                                onChange={handlePaymentChange}
                                className='flex flex-col gap-3'
                            >
                                {paymentGatwayList.map((item) => (
                                    <label
                                        key={item.value}
                                        className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer transition-all ${
                                            paymentGateway === item.value
                                                ? 'border-[#F6A429] bg-[#fffdf0] shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Radio
                                            value={item.value}
                                            size='small'
                                            sx={{
                                                color: '#0b7285',
                                                '&.Mui-checked': { color: '#0b7285' },
                                                padding: 0,
                                            }}
                                        />
                                        <img
                                            src={item.image}
                                            alt={item.label}
                                            className='h-6 object-contain'
                                        />
                                        <span className='text-sm font-medium text-gray-700'>{item.label}</span>
                                    </label>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Order Summary + Checkout */}
                    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'>
                        <div className='px-5 py-2 flex items-center gap-1.5 text-xs text-[#007600] border-b border-gray-100'>
                            <LockIcon sx={{ fontSize: 13 }} />
                            <span>Secure transaction</span>
                        </div>
                        <PricingCard />
                        <div className='px-5 pb-5 pt-2'>
                            <button
                                onClick={handleCreateOrder}
                                disabled={addresses.length === 0 || isProcessing}
                                className='w-full py-2.5 rounded-full font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                style={{
                                    background: 'linear-gradient(to bottom, #f7d56a, #f4c24d)',
                                    border: '1px solid #e1a836',
                                    color: '#111',
                                }}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className='animate-spin' width='16' height='16' viewBox='0 0 24 24' fill='none'>
                                            <circle cx='12' cy='12' r='10' stroke='rgba(0,0,0,0.2)' strokeWidth='3' />
                                            <path d='M12 2a10 10 0 0 1 10 10' stroke='#111' strokeWidth='3' strokeLinecap='round' />
                                        </svg>
                                        Processing...
                                    </>
                                ) : 'Place Order'}
                            </button>
                            {orderError && (
                                <div className='mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2'>
                                    {orderError}
                                </div>
                            )}
                            <p className='text-center text-xs text-gray-400 mt-2'>
                                By placing your order, you agree to our terms & conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <AddressForm
                        paymentGateway={paymentGateway}
                        handleClose={handleClose}
                        onAddressSaved={handleAddressSaved}
                    />
                </Box>
            </Modal>
        </div>
        </div>
    );
};

export default AddressPage;
