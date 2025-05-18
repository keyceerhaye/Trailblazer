import React from 'react';
import './Services.css';
import printing from './printing.png';
import layout from './layouting.png'; 
import {useNavigate} from 'react-router-dom';

function Services() {
    const navigate = useNavigate();
    return (  
        <section className='services' id='service'>
            <div className='content'>
                <h1>OUR SERVICES</h1>
            </div>
            <div className='services-container'>
                <div className='printing-container' onClick={() => navigate('/upload')}>
                    <div className='printer'>
                        <img src={printing} alt="Printer icon" />
                        <h2 className='printing'>Printing</h2>
                        <div className='subtext1'>
                                High-quality prints <br />
                                Document printing <br />
                                Color and black & white printing <br />
                        </div>
                    </div>
                </div>
                <div className='layout-container' onClick={() => navigate('/layout')}> 
                    <div className='layouting'>
                        <img src={layout} alt="Layout icon" />
                        <h2 className='layout'>Layout</h2>
                        <div className='subtext2'>
                            Custom layout design <br />
                            Minimalist or modern styles <br />
                            Ready-to-print layout files <br />
                        </div>
                    </div>
                </div>
                <div className='Rhombus-shapes'>
                    <div>
                        <div className='rhombus1'></div>
                        <div className='rhombus2'></div>
                        <div className='rhombus3'></div>
                        <div className='rhombus4'></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Services;