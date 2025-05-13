import axios from 'axios'

export async function createReview({ rating, msg, job_id, receiver_id }) {
  const token = localStorage.getItem('token')
  const { data } = await axios.post(
    'http://localhost:3000/reviews',
    {
      rating,
      msg,
      job_id,
      receiver_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}

export async function addResponse({ reviewId, text }) {
  const token = localStorage.getItem('token')
  const { data } = await axios.post(
    `http://localhost:3000/reviews/${reviewId}/respond`,
    {
      response: text,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return data
}
