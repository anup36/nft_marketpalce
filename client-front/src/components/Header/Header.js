import React from 'react'
import logo from '../../themes/logo.gif'
class Header extends React.Component {
  state = { address: '' }

  connectToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      this.setState({
        address: account
      })
      sessionStorage.setItem('metaMaskAddr', account)
    }
  }

  componentDidMount () {
    const metaMaskAddress = sessionStorage.getItem('metaMaskAddr')
    this.setState({
      address: metaMaskAddress
    })
  }

  render () {
    return (
      <header id='header'>
        {/* Navbar */}
        <nav
          data-aos='zoom-out'
          data-aos-delay={800}
          className='navbar navbar-expand'
        >
          <div className='container header'>
            {/* Navbar Brand*/}
            <a className='navbar-brand' href='/'>
              <img
                className='navbar-brand-sticky'
                src={logo}
                alt='sticky brand-logo'
              />
            </a>
            <div className='ml-auto' />
            {/* Navbar */}
            <ul className='navbar-nav items mx-auto'>
              <li className='nav-item'>
                <a className='nav-link' href='/' address={this.state.address}>
                  Create New
                </a>
              </li>
              <li className='nav-item dropdown'>
                {this.state.address ? (
                  <a
                    className='nav-link'
                    href={`/author/${this.state.address}`}
                  >
                    My Collection
                  </a>
                ) : null}
              </li>
            </ul>
            {/* Navbar Action Button */}
            <ul className='navbar-nav action'>
              {this.state.address ? (
                <li className='nav-item ml-3'>
                  <a className='btn ml-lg-auto btn-bordered-white'>
                    {this.state.address}
                  </a>
                </li>
              ) : (
                <li className='nav-item ml-3'>
                  <a
                    className='btn ml-lg-auto btn-bordered-white'
                    onClick={this.connectToMetaMask}
                  >
                    Connect
                  </a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}

export default Header
