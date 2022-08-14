let users = [
  { id: 1, username: "jgbispo", email: "abc@gmail.com", password: "123" },
  { id: 2, username: "jgsb20", email: "abc@gmail.com", password: "123" },
  { id: 3, username: "jgsb14", email: "abc@gmail.com", password: "123" },
]

export function getUsers() {
  let user_no_pass = []
  users.map(user => {
    user.password = "****"
    user_no_pass.push(user)
  })
  return user_no_pass;
}

export function getUser(username) {
  const foundUser = users.filter(usr => usr.username == username);
  return foundUser
}

export function saveUser(user) {
  const numberIdOfLastUser = users.length - 1
  user['id'] = users[numberIdOfLastUser].id + 1
  users.push(user);
}

export function deleteUser(id) {
  const numberOfUsers = users.length
  users = users.filter(user => user.id != id);
  return users.length !== numberOfUsers
}

export function replaceUser(id, user) {
  const foundUser = users.filter(usr => usr.id == id);
  if (foundUser.length === 0) return false
  users = users.map(usr => {
    if (id == usr.id) {
      usr = { id: usr.id, ...user };
    }
    return usr
  })
  return true
}

