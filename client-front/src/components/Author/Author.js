import React, { Component } from 'react';
import AuthorProfile from '../AuthorProfile/AuthorProfile';

class Author extends Component {
    render() {
        return (
            <section className="author-area explore-area popular-collections-area">
                <div className="container">
                    <div className="row justify-content-between">
                        <div className="col-12 col-md-4">
                            {/* Author Profile */}
                            <AuthorProfile />
                        </div>
                        <div className="col-12 col-md-8">
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Author;