import React, { Component } from 'react';

import Header from '../components/Header/Header';
import Creates from '../components/Create/Create';
import Footer from '../components/Footer/Footer';
import Scrollup from '../components/Scrollup/Scrollup';

class Create extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                <Creates />
                <Footer />
                <Scrollup />
            </div>
        );
    }
}

export default Create;