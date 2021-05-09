configureOTPEmail = (name, code) => {
    const txt = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            /* latin */
            @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 300;
                src: local('Montserrat Light'), local('Montserrat-Light'), url(https://fonts.gstatic.com/s/montserrat/v14/JTURjIg1_i6t8kCHKm45_cJD3gnD_g.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                
                /* latin */
                @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 400;
                src: local('Montserrat Regular'), local('Montserrat-Regular'), url(https://fonts.gstatic.com/s/montserrat/v14/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                
                /* latin */
                @font-face {
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 500;
                src: local('Montserrat Medium'), local('Montserrat-Medium'), url(https://fonts.gstatic.com/s/montserrat/v14/JTURjIg1_i6t8kCHKm45_ZpC3gnD_g.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }

    
                .body .full_wrap {
                    width: 600px !important;
                    width: 600px !important;
                    /* height: 100vh !important; */
                    border: 2px solid #000;
                }
    
                body {
                    font-family: "Helvetica Neue", Helvetica;
                    /* background: rgb(37, 37, 37); */
                }
    
                .main_table {
                    /* margin-left: 25%;
                    margin-right: 25%; */
                    /* background: linear-gradient(-225deg, #7DE2FC 0%, #B9B6E5 100%); */
                    /* background: rgb(37, 37, 37); */
                    height: 700px !important;
                    border-radius: 4px;

                    background-color: #FFFFFF;
                    background-image: url(https://i.ibb.co/0Fwh04s/light-paper-fibers.png);
                    background-blend-mode: overlay;
                    /* width: 100vw;
                    height: 100vh; */
                    /* overflow-x: hidden !important;
                    overflow-y: hidden !important; */
                    /* font-family: Montserrat, sans-serif; */
                    font-family: "Helvetica Neue", Helvetica;
                }
    
                .head_section_td {
                    /* padding-top: 15px !important; */
                    /* padding-left: 1px !important; */
                    width: 100% !important;
                }
                .body_section_td {
                    padding-left: 15px !important;
                    width: 100% !important;
                }
                .footer_section_td {
                    /* padding-left: 15px !important; */
                    width: 100% !important;
                    text-align: center;
                    color: #000000;
    
                }
                .head_section h1 {
                    /* color: #d3d3d3; */
                    color: rgb(229, 229, 229); ;
                    font-weight: 500;
                    font-size: 50px;
                    margin: 0;
                    padding: 0;
                    margin-left: 7.5px;
                }
                .employerInfo {
                    font-weight: 300;
                }
                .head_section h1 span {
                    color: rgb(87, 189, 112);
                }
                .body_section {
                    color: rgb(229, 229, 229);
                }
                .upper {
                    border-bottom: 5px solid rgb(229, 229, 229);
                }
                /* td {
                    border: 2px solid green;
                } */
        </style>
    </head>
    <body>
        <table class="full_wrap" valign="top" width="100% !important" cellspacing="0" 
        cellpadding="0" border="0" bgcolor="white" align="center" >
    
            <tbody style="width: 100%; height: 100%;" valign="middle">
                <tr style="width: 100%;">
                    <td style="width: 600px !important; margin: 0; padding: 0; height: 700px !important;">
                            <center>
                                    <table class="main_table" valign="middle" style="width: 100% !important; max-width: 100% !important;">
                                        <tbody style="width: 100% !important;">
                                            <!-- Header Section -->
                                            <tr class="head_section">
                                                <td class="head_section_td upper"><h1><span>Serve</span></h1></td>
                                            </tr>
                
                                            <!-- Body Section -->
                                            <tr class="body_section">
                                                <td class="body_section_td upper">
                                                        <h2 style="font-weight: 300; color: #000000;">Dear <strong>${name}</strong>,</h2> <br>
                
                                                        <h3 style="font-weight: 300; color: #000000;">Your login code is <strong>${code}</strong>.</h3> 
                                                        <h3 style="font-weight: 300; color: #000000;">As a security measure, this code expires in 10 minutes, or once used. Please do not share this code with anyone.</h3> <br>
                                                        
                                                        <h3 style="font-weight: 300; color: #000000;">The Serve team.</h3>
                                                </td>
                                            </tr>
                
                                            <!-- Footer Section -->
                                            <tfoot class="footer_section">
                                                <td class="footer_section_td">
                                                    <p style="font-weight: 300; font-size: 7px;">Contact us on social media; we'll respond.</p> 
                                                    <span>
                                                        <img width="20px" height="20px" style="margin-right: 2px;" src="https://i.ibb.co/86MTyt9/001-instagram.png" alt="Instagram" class="insta_logo"/>

                                                        <img width="20px" height="20px" src="https://i.ibb.co/99x9gp5/002-twitter.png" alt="Twitter" class="twitter_logo"/>
                                                    </span>
                                                    <p style="font-weight: 300; font-size: 7px;">Earth, Solar System, Milky Way Galaxy.</p>
                                                </td>
                                            </tfoot>
                                        </tbody>
                                    </table>
                                    </center>
                    </td>
    
                </tr>
            </tbody>
        </table>
        
    </body>
    </html>`;
    return txt;
};

module.exports = { configureOTPEmail };