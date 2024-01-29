class Atrativo{

    #id
    #nome
    #latitude
    #longitude
    #descricao
    #imagem
    constructor(nome, latitude, longitude, imagem, descricao ){
       
        this.#nome  = nome 
        this.#latitude  = latitude 
        this.#longitude  = longitude 
        this.#imagem  = imagem 
        this.#descricao  = descricao 
        
    }

    get id() {
        return this.#id
    }
    set id(value) {
        this.#id = value
    }

   
    get nome() {
        return this.#nome 
    }
    set nome(value) {
        this.#nome = value
    }
   
    get latitude() {
        return this.#latitude 
    }
    set latitude(value) {
        this.#latitude = value
    }
   
    get longitude() {
        return this.#longitude
    }
    set longitude(value) {
        this.#longitude = value
    }
   
    get descricao() {
        return this.#descricao
    }
    set descricao(value) {
        this.#descricao  = value
    }  
    get imagem() {
        return this.#imagem
    }
    set imagem(value) {
        this.#imagem  = value
    }
     
    toJson(){
        return {
            "id": this.#id,
            "nome": this.#nome,
            "latitude": this.#latitude,
            "longitude": this.#longitude,
            "descricao": this.#descricao,
            "imagem": this.#imagem
            
        }
    }
}


module.exports = Atrativo