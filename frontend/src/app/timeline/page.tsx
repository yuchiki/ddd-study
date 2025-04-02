import styles from './page.module.css'


export default async function Timeline() {
  const content = await fetch(process.env.BACKEND_URL + '/timeline')

  // parse content as json

  const json = await content.json()

  return (
    <div className={styles.posts}>
      <h1>タイムライン</h1>
      <ul>
      {json.right.map((post: any) =>
        <li key={post.id} >
          <h2 >@{post.user.username }</h2>
          <p >{post.content}</p>
          </li>
      )}
      </ul>
      </div>
  )
}
