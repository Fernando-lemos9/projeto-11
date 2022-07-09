import {GithubUser} from './GithubUser.js'
// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites{
  constructor(root) {
   this.root = document.querySelector(root)
   this.load()

  }
  
  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

  //  this.entries = [
  //     {
  //       login: 'maykbrito',
  //       name: 'Mayk Brito',
  //       public_repos: '76',
  //       fallowers: '120000'
  //     },
  //     {
  //         login: 'diego3g',
  //         name: 'Diego Fernandes',
  //         public_repos: '76',
  //         fallowers: '120000'
  //     }
  //   ]

  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

 async add(username){
  try {

    const userExists = this.entries.find(entry => entry.login === username)

    console.log(userExists)

    if (userExists) {
      throw new Error('Usuário já cadastrado')
    }

    console.log(username) // verficar se está chegando os dados do input
    const user = await GithubUser.search(username)
    console.log(user) // verficar se está chegando os dados do github

    if(user.login === undefined) {
      throw new Error('Usuário não encontrado!')
    }

    this.entries = [user, ...this.entries]
    this.update()
    this.save()

  } catch(error) {
    alert(error.message)
  }

  }

  delete(user) {
    const filteredEntreies = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntreies
    this.update()
    this.save()

    console.log(filteredEntreies)
  }

}

// classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    console.log(this.root)
    
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
    
      // console.log(value) ver a entrada de dados

      this.add(value)
    }
  }


  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`

      row.querySelector('.user img').alt = `imagem de ${user.name}`

      row.querySelector('.user a').href = `https://github.com/${user.login}`

      row.querySelector('.user p').textContent = user.name

      row.querySelector('.user span').textContent = user.login

      row.querySelector('.repositories').textContent = user.public_repos

      row.querySelector('.followers').textContent = user.followers
     
      row.querySelector('.remove').onclick = () => {
       const deleterYes = confirm(`Tem certeza que deseja deletar essa pessoa?`)

       if (deleterYes) {
        this.delete(user)
       }
      }
      
      this.tbody.append(row)
    })
    

  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>maykbrito</span>
      </a>
      <td class="repositories"> 76</td>
      <td class="followers">9989</td>
      <td><button class="remove">&times;</button></td> 
      </tr>
    </td>`

    return tr

  }

  removeAllTr() {
    const tbody = this.root.querySelector('table tbody')
    
    tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
    })
  }
}
