import React, { useEffect, useState } from 'react';


import { FaAngleRight } from 'react-icons/fa6';
import { FaAngleLeft } from 'react-icons/fa6';

import banner1 from '../assest/banner/banner1.jpeg';
import banner2 from '../assest/banner/banner2.jpeg';
import banner3 from '../assest/banner/banner3.jpeg';
import banner4 from '../assest/banner/banner4.jfif';

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const desktopImages = [
        banner1, banner2, banner3, banner4
    ];

    const mobileImages = [
      
    ];

    const images = isMobile ? mobileImages : desktopImages;

    const nextImage = () => {
        if (images.length - 1 > currentImage) {
            setCurrentImage(prev => prev + 1);
        }
    };

    const preveImage = () => {
        if (currentImage !== 0) {
            setCurrentImage(prev => prev - 1);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // 768px is the breakpoint for mobile
        };

        window.addEventListener('resize', handleResize);

        // Check initial window size
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (images.length - 1 > currentImage) {
                nextImage();
            } else {
                setCurrentImage(0);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentImage, images.length]);

    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-56 md:h-72 w-full bg-slate-200 relative'>

                <div className='absolute z-10 h-full w-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl'>
                        <button onClick={preveImage} className='bg-white shadow-md rounded-full p-1'>
                            <FaAngleLeft />
                        </button>
                        <button onClick={nextImage} className='bg-white shadow-md rounded-full p-1'>
                            <FaAngleRight />
                        </button> 
                    </div>
                </div>

                {/** Version chung cho cả desktop và mobile */}
                <div className={`flex h-full w-full overflow-hidden ${isMobile ? '' : 'md:flex'}`}>
                    {images.map((imageURL, index) => (
                        <div className='w-full h-full min-w-full min-h-full transition-all' key={imageURL} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                            <img src={imageURL} className='w-full h-full object-cover' />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BannerProduct;