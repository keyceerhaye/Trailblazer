import React from 'react';
import './How It Works.css';
import upload from './upload-printing-icon.png';
import print from './printing-icon.png';
import deliver from './deliver-icon.png';
import get from './get-print-icon.png';
import choose from './template-icon.png';
import modify from './modify-icon.png';
import getLayout from './get-print-icon.png';

function HowItWorks() {
    return (  
        <section className="HowItWorks">
            <div className="content">
                <h1 className='heading'>HOW IT WORKS</h1>
                <h2 className='subheading1'>Printing Service</h2>
                <div className='printing-circles'>
                    <div className='step'>
                        <div className='circle1'>
                            <div className='upload'>
                                <img src={upload} alt="upload your files icon"/>
                            </div>
                        </div>
                        <h2 className='printing-subtext1'>Upload Your Files</h2>
                        <div className='upload-text'>
                            <p>Send us your files <br />
                            through our order<br />
                            form make sure to <br />
                            include the size, <br />
                            number of copies, <br />
                            and other specifications.</p>
                        </div>
                    </div>

                    <div className='step'>
                        <div className='circle2'>
                            <div className='printing'>
                                <img src={print} alt="printing icon for how it works"/>
                            </div>
                        </div>
                        <h2 className='printing-subtext2'>Print</h2>
                        <div className='printing-text'>
                            <p>Once we receive your <br />
                            request, we'll prepare <br />
                            and print your order <br />
                            using high-quality materials <br />
                            and equipment.</p>
                        </div>
                    </div>

                    <div className='step'>
                        <div className='circle3'>
                            <div className='delivery'>
                                <img src={deliver} alt="Pickup or deliver icon" />
                            </div>
                        </div>
                        <h2 className='printing-subtext3'>Pickup or Deliver</h2>
                        <div className='delivery-text'>
                            <p>Choose to pick up <br />
                            your print at our <br />
                            campus location or <br />
                            have it delivered if <br />
                            available.</p>
                        </div>
                    </div>

                    <div className='step'>
                        <div className='circle4'>
                            <div className='get-print'>
                                <img src={get} alt="Get your print icon" />
                            </div>
                        </div>
                        <h2 className='printing-subtext4'>Get Your Print</h2>
                        <div className='get-print-text'>
                            <p>
                            Receive your printed <br />
                            output fast, clean, <br />
                            and ready to go!
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className='subheading2'>Layout Service</h2>
                <div className='layout-circles'>
                    <div className='step1'>
                        <div className='circle5'>
                            <div className='choose-layout'>
                                <img src={choose} alt="Choose your template icon" />
                            </div>
                        </div>
                        <h2 className='layout-subtext1'>Choose Your Template</h2>
                        <div className='choose-text'>
                            <p>Pick from our <br />
                            available layout <br />
                            templates or let us <br />
                            know if you want a <br />
                            custom design.</p>
                        </div>
                    </div>

                    <div className='step1'>
                        <div className='circle6'>
                            <div className='modify-layout'>
                                <img src={modify} alt="Modify your template icon" />
                            </div>
                        </div>
                        <h2 className='layout-subtext2'>Modify Your Template</h2>
                        <div className='modify-text'>
                            <p>Send us your content <br />
                            (text, images, logos, <br />
                            etc.), and we'll <br />
                            customize the <br />
                            template to match <br />
                            your project needs.</p>
                        </div>
                    </div>

                    <div className='step1'>
                        <div className='circle7'>
                            <div className='get-layout'>
                                <img src={getLayout} alt="Get your layout icon" />
                            </div>
                        </div>
                        <h2 className='layout-subtext3'>Get Your Layout</h2>
                        <div className='get-layout-text'>
                            <p>We'll send you the <br />
                            final layout file, ready <br />
                            for printing or <br />
                            submission.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default HowItWorks;