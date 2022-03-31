import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  OWNER_ADDRESS,
  PRIVATE_KEY,
  USDT_ADDRESS,
  USDC_ADDRESS,
  CHAINLINK_ADDRESS,
  TOKEN_ABI,
  PAYMENT_AMT
} from '../../config/config'
import ModalPopup from '../Modal/ModalPopUp'
import axios from 'axios'
import HDWalletProvider from '@truffle/hdwallet-provider'

const web3 = new Web3(window.ethereum)
const nftContract = new web3.eth.Contract(
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS
)

const usdtContract = new web3.eth.Contract(TOKEN_ABI, USDT_ADDRESS)
const usdcContract = new web3.eth.Contract(TOKEN_ABI, USDC_ADDRESS)
const chainLinkContract = new web3.eth.Contract(TOKEN_ABI, CHAINLINK_ADDRESS)
function Create () {
  const [selectedFile, setSelectedFile] = useState()
  const [isFilePicked, setIsFilePicked] = useState()
  const [isCreating, setIsCreating] = useState()
  const [address, setAddress] = useState()
  const [trigger, setTrigger] = useState(false)
  const [coin, setCoin] = useState()

  const onChange = event => {
    console.log('Inside Change Handler')
    let files = event.target.files

    setIsFilePicked(true)
    setSelectedFile(files[0])
  }

  const mintImage = async (nftName, descript, uri) => {
    const provider = new HDWalletProvider(PRIVATE_KEY, window.ethereum)
    const web3 = new Web3(provider)
    const nftContract = new web3.eth.Contract(
      NFT_CONTRACT_ABI,
      NFT_CONTRACT_ADDRESS
    )
    await nftContract.methods
      .mintNFT(address, uri, nftName, descript)
      .send({
        from: OWNER_ADDRESS
      })
      .once('transactionHash', function () {
        console.log('Transaction Processing............')
      })
      .once('receipt', function () {
        console.log('Ethereum Reciept')
      })
      .once('confirmation', function () {
        alert(`Your NFT: ${nftName} has been minted!`)
        setIsCreating(false)
        window.location.reload()
      })
      .once('error', async function () {
        alert('Ethereum Error Encountered!')
        setIsCreating(false)
        window.location.reload()
      })
  }

  const changeTrigger = e => {
    e.preventDefault()
    setTrigger(true)
  }

  const onSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const name = document.getElementById('name').value
      const description = document.getElementById('textarea').value

      const imageHash = await axios
        .post('http://localhost:4000/api/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .catch(err => {
          alert('Select A File Before Minting!')
        })

      setIsCreating(true)

      const payload = {
        nftName: name,
        descript: description,
        imgHash: imageHash.data.data
      }

      const fileHash = await axios.post(
        'http://localhost:4000/api/createJson',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('paying fees')
      await payFees(name, description, fileHash.data.data, coin)
    } catch (error) {
      alert(`error: ${error}`)
      console.log('err', error)
    }
  }

  useEffect(() => {
    setAddress(sessionStorage.getItem('metaMaskAddr'))
    document.title = 'Create New NFT - NFT Collection'
  }, [address])

  const payFees = async (nftName, descript, uri) => {
    console.log('nftName', nftName, descript, uri, coin)
    console.log('address', address)
    switch (coin) {
      case 0:
        await web3.eth
          .sendTransaction({
            from: address,
            value: PAYMENT_AMT,
            to: NFT_CONTRACT_ADDRESS
          })
          .once('transactionHash', function () {
            console.log('Transaction Processing............')
          })
          .once('receipt', function () {
            console.log('Ethereum Reciept')
          })
          .once('confirmation', async () => {
            alert('Processing Payment for ETH, Please be Patient')
            await mintImage(nftName, descript, uri)
          })
          .once('error', () => {
            alert('ERROR: Transaction Errored! Please Retry After Some Time.')
            window.location.reload()
          })
        break

      case 1:
        await usdtContract.methods
          .transfer(NFT_CONTRACT_ADDRESS, PAYMENT_AMT)
          .send({
            from: address
          })
          .once('transactionHash', function () {
            console.log('Transaction Processing............')
          })
          .once('receipt', function () {
            console.log('Ethereum Reciept')
          })
          .once('confirmation', async () => {
            alert('Processing Payment for USDT, Please be Patient')
            await mintImage(nftName, descript, uri)
          })
          .once('error', () => {
            alert('ERROR: Transaction Errored! Please Retry After Some Time.')
            window.location.reload()
          })
        break

      case 2:
        await usdcContract.methods
          .transfer(NFT_CONTRACT_ADDRESS, PAYMENT_AMT)
          .send({
            from: address
          })
          .once('transactionHash', function () {
            console.log('Transaction Processing............')
          })
          .once('receipt', function () {
            console.log('Ethereum Reciept')
          })
          .once('confirmation', async () => {
            alert('Processing Payment for USDC, Please be Patient')
            await mintImage(nftName, descript, uri)
          })
          .once('error', () => {
            alert('ERROR: Transaction Errored! Please Retry After Some Time.')
            window.location.reload()
          })
        break

      case 3:
        await chainLinkContract.methods
          .transfer(NFT_CONTRACT_ADDRESS, PAYMENT_AMT)
          .send({
            from: address
          })
          .once('transactionHash', function () {
            console.log('Transaction Processing............')
          })
          .once('receipt', function () {
            console.log('Ethereum Reciept')
          })
          .once('confirmation', async () => {
            alert('Processing Payment for ChainLink, Please be Patient')
            await mintImage(nftName, descript, uri)
          })
          .once('error', () => {
            alert('ERROR: Transaction Errored! Please Retry After Some Time.')
            window.location.reload()
          })
        break

      default:
        alert('Invalid Choice')
        window.location.reload()
        break
    }
  }

  return (
    <section className='author-area'>
      <div className='container'>
        <div className='row justify-content-between'>
          <div className='col-12 col-md-7'>
            {/* Intro */}
            <div className='intro mt-5 mt-lg-0 mb-4 mb-lg-5'>
              <div className='intro-content'>
                <span>Get Started</span>
                <h3 className='mt-3 mb-0'>Create Item</h3>
              </div>
            </div>
            <ModalPopup trigger={trigger} setTrigger={setTrigger}>
              <h3 style={{color: 'black'}}>
                Pay Using Any Of The Following:
              </h3>
              <input
                type='checkbox'
                id='eth'
                onClick={() => setCoin(0)}
              />
              <label htmlFor='eth'>{' '} ETH</label>
              <input type='checkbox' id='usdt' onClick={() => setCoin(1)} />
              <label htmlFor='usdt'>{' '} USDT</label>
              <input type='checkbox' id='usdc' onClick={() => setCoin(2)} />
              <label htmlFor='usdc'>{' '} USDC</label>
              <input
                type='checkbox'
                id='chainlink'
                onClick={() => setCoin(3)}
              />
              <label htmlFor='chainlink'>{' '} LINK</label>
              <button onClick={onSubmit}>Pay</button>
            </ModalPopup>
            {/* Item Form */}
            <form className='item-form card no-hover'>
              <div className='row'>
                <div className='col-12'>
                  <div className='input-group form-group'>
                    <div className='custom-file'>
                      <input
                        type='file'
                        className='custom-file-input'
                        id='inputGroupFile01'
                        onChange={onChange}
                      />
                      <label
                        className='custom-file-label'
                        htmlFor='inputGroupFile01'
                      >
                        {isFilePicked && selectedFile['size'] <= 10000000
                          ? `${selectedFile.name}`
                          : 'Choose File'}
                      </label>
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <div className='form-group mt-3'>
                    <input
                      type='text'
                      className='form-control'
                      name='name'
                      placeholder='Item Name'
                      required='required'
                      id='name'
                    />
                  </div>
                </div>
                <div className='col-12'>
                  <div className='form-group'>
                    <textarea
                      className='form-control'
                      name='textarea'
                      placeholder='Description'
                      cols={30}
                      rows={3}
                      defaultValue={''}
                      id='textarea'
                    />
                  </div>
                </div>
                <div className='col-12'>
                  <button
                    className='btn w-100 mt-3 mt-sm-4'
                    type='submit'
                    onClick={changeTrigger}
                  >
                    {isCreating && isFilePicked
                      ? 'Creating.......'
                      : 'Create Item'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ModalPopup trigger={trigger} setTrigger={setTrigger}>
        <h3>Pay Using Any Of The Following:</h3>
        <input type='checkbox' id='eth' onClick={() => setCoin(0)} />
        <label htmlFor='eth'>ETH</label>
        <input type='checkbox' id='usdt' onClick={() => setCoin(1)} />
        <label htmlFor='usdt'>USDT</label>
        <input type='checkbox' id='usdc' onClick={() => setCoin(2)} />
        <label htmlFor='usdc'>USDC</label>
        <input type='checkbox' id='chainlink' onClick={() => setCoin(3)} />
        <label htmlFor='chainlink'>LINK</label>

        <button onClick={onSubmit}>Pay</button>
      </ModalPopup>
    </section>
  )
}

export default Create
