import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import coverImg from '../../themes/coverImage.jpg'
import avatarImg from '../../themes/logo.gif'
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from '../../config/config'

const NftView = ({ uri }) => {
  const [img, setImg] = useState(true)
  const [src, setSrc] = useState('')
  const [name, setName] = useState()
  const [description, setDescription] = useState()

  const loadMedia = src => {
    var img = new Image()
    img.onerror = () => {
      setImg(false)
    }
    img.src = src
  }

  const fetchImageObject = async uri => {
    try {
      axios.get(`https://gateway.pinata.cloud/ipfs/${uri}`).then(resp => {
        const url = `https://ipfs.io/ipfs/${resp.data.url}`
        setSrc(url)
        loadMedia(url)
        setDescription(resp.data.description)
        setName(resp.data.name)
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchImageObject(uri)
  }, [])
  if (img) {
    return (
      <>
        {' '}
        <img
          style={{ height: '250px', width: '300px' }}
          className='card-img-top'
          src={src}
          alt=''
        />
        <p style={{ color: 'white' }}>Name: {name}</p>
        <p style={{ color: 'white' }}>Description: {description}</p>
        <button className='btn w-100 mt-3 mt-sm-4'>View</button>
      </>
    )
  }
  return (
    <>
      <video
        autoPlay
        loop
        muted
        className='card-img-top'
        src={src}
        alt=''
      ></video>
      <p style={{ color: 'white' }}>Name: {name}</p>
      <p style={{ color: 'white' }}>Description: {description}</p>
      <button className='btn w-100 mt-3 mt-sm-4'>View</button>
    </>
  )
}

class AuthorProfile extends Component {
  state = {
    data: {
      img: 'img/author_1.jpg',
      authorImg: 'img/author_2.jpg'
    },
    nfts: [],
    socialData: [],
    author: ''
  }

  NftDetails = async () => {
    const web3 = new Web3(window.ethereum)
    const nftContract = new web3.eth.Contract(
      NFT_CONTRACT_ABI,
      NFT_CONTRACT_ADDRESS
    )

    const tokenIds = await nftContract.methods._tokenCounter().call()

    let nfts = []

    for (let i = 1; i <= tokenIds; i++) {
      const nft = await nftContract.methods.getNft(i).call()
      if (nft['creator'].toLowerCase() == this.state.author) {
        nfts.push({ uri: nft['uri'], id: i })
      } else {
        console.log('error')
      }
    }
    this.setState({
      nfts: nfts
    })
  }

  async componentDidMount () {
    document.title = 'My Collection - NFT Collection'
    const address = sessionStorage.getItem('metaMaskAddr')
    this.setState({
      author: address
    })

    await this.NftDetails()
  }

  render () {
    return (
      <>
        <div className='card no-hover text-center'>
          <div className='image-over'>
            <img className='card-img-top' src={coverImg} alt='' />
            {/* Author */}
            <div className='author'>
              <div className='author-thumb avatar-lg'>
                <img className='rounded-circle' src={avatarImg} alt='' />
              </div>
            </div>
          </div>
          {/* Card Caption */}
          <div className='card-caption col-12 p-0'>
            {/* Card Body */}
            <div className='card-body mt-4'>
              <p className='my-3'>These Are NFTs Minted By You!</p>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  placeholder={this.state.author}
                />
              </div>
              <a className='btn btn-bordered-white btn-smaller mt-5'>Welcome</a>
            </div>
          </div>
          {/* <h5 className='mb-2'>{item.name}</h5>
                    <span>{item.content}</span>
                    <hr /> */}
        </div>
        <div style={{ overflow: 'visible' }} className='row items'>
          {this.state.nfts?.map((item, idx) => {
            return (
              // <div
              //   style={{ cursor: 'pointer' }}
              //   className='card no-hover text-center'
              //   key={idx}
              // >
                <div className='col-12 col-md-12 col-sm-4 item explore-item'>
                  <div
                    style={{ cursor: 'pointer' }}
                    className='card no-hover text-center'
                  >
                    <div className='image-over' key={`eds_${idx}`}>
                    <a
                      href={`https://testnets.opensea.io/assets/${NFT_CONTRACT_ADDRESS}/${item.id}`}
                      target='_blank'
                    >
                      <NftView uri={item.uri} />
                    </a>
                  </div>
                  </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }
}

export default AuthorProfile
