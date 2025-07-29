import React, { useState } from 'react'

// import CTAButton from "../HomePage/Button";
import countrycode from "../../data/countrycode.json"
// import { apiConnector } from '../../services/apiconnector';
// import { contactusEndpoint } from "../../services/apis"


const ContactUsForm = ({heading, subHeading, width}) => {

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ FirstName: "", LastName: "", Email: "", PhoneNumber: "", Message: "",  });
    
    const changeHandler= (event) => {

        setFormData( (prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        })
    }


    const submitHandler = async (event) => {
        event.preventDefault();
        console.log("Form Data - ", formData)
        try {
            setLoading(true)
            // const res = await apiConnector(
            //     "POST",
            //     contactusEndpoint.CONTACT_US_API,
            //     formData,
            // )
            const res = "ok"
            console.log("Email Res - ", res)
            setLoading(false)
            
        }catch(error) {
            console.log("ERROR MESSAGE - ", error.message)
            setLoading(false)
        }
    }

  return (

    <div>
        {
            loading ? (<div className='spinner'></div>) : (

                <div className={`mx-auto flex flex-col justify-center items-center gap-10`}>
            
                    <div className='flex flex-col gap-3  justify-center'>
                        <h1 className='text-richblack-5 text-4xl flex justify-center font-semibold'> {heading} </h1>
                        <p className='text-richblack-300 font-semibold'> {subHeading} </p>
                    </div>
                    
                    <form onSubmit={submitHandler} className='flex w-full flex-col gap-7'>
                    
                        {/* for name */}
                        <div className='flex justify-between'>
                            <label htmlFor='firstName' className='w-[48%]'>
                                <p className='text-richblack-5 text-sm'>First Name</p>
                                <input 
                                    type='input'
                                    required
                                    name='FirstName'
                                    placeholder='Enter first name'
                                    value={formData.FirstName}
                                    onChange={changeHandler} 
                                    id='firstName'
                                    className='p-3 rounded-lg bg-richblack-700 w-full mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none'  
                                    />
                            </label>
            
            
                            <label htmlFor='lastName' className='w-[48%]'>
                                <p className='text-richblack-5 text-sm'>Last Name</p>
                                <input 
                                    type='input'
                                    required
                                    name='LastName'
                                    placeholder='Enter last name'
                                    value={formData.LastName}
                                    onChange={changeHandler} 
                                    id='lastName'
                                    className='p-3 rounded-lg bg-richblack-700 w-full mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none'  
                                    />
                            </label>
                        </div>
                    
            
                        {/* for email */}
                        <label htmlFor='email'>
                            <p className='text-richblack-5 text-sm'>Email Address</p>
                            <input 
                                type='email'
                                required
                                name='Email'
                                placeholder='Enter email address'
                                value={formData.Email}
                                onChange={changeHandler} 
                                id='email'
                                className='p-3 rounded-lg bg-richblack-700 w-full mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none'  
                                />
                        </label>
            
            
                        {/* for phone Number */}
                        <div className='flex flex-col justify-between'>
            
                            <p className='text-richblack-5 text-sm'>Phone Number</p>
                                                
                            <div className='flex justify-between'>
            
                                <label htmlFor='code' className='w-[15%]'>
            
                                    {/* <input
                                        type='input'
                                        className='p-3 rounded-lg bg-richblack-700 w-full mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none'
                                    />                            */}
            
                                    <select className='p-3 rounded-lg bg-richblack-700 w-full h-12  mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none '>
            
                                        {
                                            countrycode.map( (country,key) => (
                                                <option key={key}  value={country.code} selected={country.country === "India"}>
                                                    {country.code} - {country.country}
                                                </option>
                                            ))
                                        }
            
                                    </select>
            
                                </label>
            
            
                                <label htmlFor='phoneNumber' className='w-[81%]'>
            
                                    <input 
                                        type='number'
                                        required
                                        minLength={10}
                                        maxLength={10}
                                        name='PhoneNumber'
                                        value={formData.Number}
                                        placeholder='12345 67890'
                                        id='phoneNumber'
                                        onChange={changeHandler}
                                        className='p-3 rounded-lg bg-richblack-700 w-full h-12 mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none'
                                    />
            
                                </label>
            
                            </div>
                            
                        </div>
            
            
                        {/* text Area */}
                        <label htmlFor='message'>
                            <p className='text-richblack-5 text-sm'>Message</p>
                            <textarea
                                required
                                rows={7}
                                cols={7}
                                name='Message'
                                value={formData.Message}
                                placeholder='Enter your message here'
                                id='message'
                                onChange={changeHandler}
                                className='p-3 rounded-lg bg-richblack-700 w-full mt-1 shadow-sm text-white shadow-richblack-50 placeholder:text-richblack-300 outline-none'
                            />
            
            
                        </label>
                    
                                     
                        <button className='w-full bg-yellow-50 text-center flex justify-center item-center text-black font-semibold p-2 rounded-lg'>Send Message</button>

                        {/* <button type='submit'>
                            <CTAButton active={true}>Sent Message</CTAButton>
                        </button> */}
            
                            
                    </form>
            
                </div>
            )
        }
    </div>

  )
}

export default ContactUsForm;;