import axios from 'axios'
import refreshToken from './refreshToken'

async function getHeader() {
  let token = await refreshToken()
  console.log(token)

  const header = {
    Authorization: `Bearer ${token}`,
  };

  const axiosConfig = {
    baseURL: `https://api.lightspeedapp.com/API/Account/${process.env.ACCOUNT_ID}/`,
    headers: header
  }

  return axiosConfig
}

export async function getItems() {
  let axiosConfig = await getHeader()
  console.log(axiosConfig)
  return axios.get(`Item.json?manufacturerID=168&load_relations=["Category", "Images", "ItemShops", "CustomFieldValues"]`, axiosConfig)
}

export async function getItem(itemID) {
  let axiosConfig = await getHeader()
  return axios.get(`Item/${itemID}.json?load_relations=["Category", "Images", "ItemShops", "CustomFieldValues"]`, axiosConfig)
}

export async function createSale(newSale) {
  let axiosConfig = await getHeader()
  return axios.post(`Sale.json`, newSale)
}