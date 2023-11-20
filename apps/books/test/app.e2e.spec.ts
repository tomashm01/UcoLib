import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../src/infraestructure/controller/book.controller';
import { BOOK_SERVICE, BookService } from '../src/infraestructure/service';
import { BookDTO } from '../src/utils';
import { NotFoundException } from '@nestjs/common';
import { BookMongoRepository,BookMongoFinder } from '../src/infraestructure/service'
import { BOOK_REPOSITORY, Book, BookBarCode } from '../src/domain';
import { BookRepository } from '../src/domain';
import { BookProviders } from '../src/infraestructure/book.providers';
import { BOOK_FINDER, BookFinder, CREATE_BOOK, CreateBook } from '../src/application';
import { BookModule } from '../src/infraestructure/app.module';


// TEST BOOKS

describe('BookController', () => {

  let createBook: CreateBook;
  let bookService: BookService;
  let bookFinder: BookFinder;
  let repo: BookMongoRepository;


  let controller: BookController; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BookModule],
    }).compile();

    createBook = module.get<CreateBook>(CREATE_BOOK);
    bookService = module.get<BookService>(BOOK_SERVICE);
    bookFinder = module.get<BookFinder>(BOOK_FINDER);
    repo = module.get<BookMongoRepository>(BOOK_REPOSITORY);
    await repo.deleteAll();
  });

  
  it('should be defined', () => {
    expect(bookService).toBeDefined();
    expect(bookFinder).toBeDefined();
    expect(repo).toBeDefined();
    expect(createBook).toBeDefined();
  });


  it('should create a new book', async () => {
    const bookId = '84dbed59-9e56-4dd2-96fb-59c5ae11bd54';
    const bookBarCode = '979-8858358268';
    const bookTitle = 'Twilight';
    const bookAuthor = 'Stephenie Meyer';
    const bookGenre = 'Romance';
    const bookImage = 'image.jpg';
 
    const book = await createBook.execute(bookId, bookBarCode, bookTitle, bookAuthor, bookGenre, bookImage);
 
    
    expect(book).toBeDefined();
    expect(book.bookId.value).toEqual(bookId);
    expect(book.barCode.value).toEqual(bookBarCode);
    expect(book.title.value).toEqual(bookTitle);
    expect(book.author.value).toEqual(bookAuthor);
    expect(book.genre.value).toEqual(bookGenre);
    expect(book.stock.value).toEqual(1);
    expect(book.image.value).toEqual(bookImage);
  });

  it('should throw BookAlreadyExistsError if book with the same ISBN exists', async () => {
    const bookId = '84dbed59-9e56-4dd2-96fb-59c5ae11bd54';
    const bookBarCode = '979-8858358268';
    const bookTitle = 'Twilight';
    const bookAuthor = 'Stephenie Meyer';
    const bookGenre = 'Romance';
    const bookImage = 'image.jpg';


    const book = await createBook.execute(bookId, bookBarCode, bookTitle, bookAuthor, bookGenre, bookImage);
    await expect(createBook.execute(bookId, bookBarCode, bookTitle, bookAuthor, bookGenre, bookImage)).rejects
    .toThrow('Book already exists');
  });

  it('should find a book by ISBN', async () => {
    const bookId = '84dbed59-9e56-4dd2-96fb-59c5ae11bd54';
    const bookBarCode = '979-8858358268';
    const bookTitle = 'Twilight';
    const bookAuthor = 'Stephenie Meyer';
    const bookGenre = 'Romance';
    const bookImage = 'image.jpg';

    const book = await createBook.execute(bookId, bookBarCode, bookTitle, bookAuthor, bookGenre, bookImage);
    const bookFound = await bookFinder.findByIsbn(BookBarCode.with(bookBarCode));
    expect(bookFound).toBeDefined();
    expect(bookFound.id).toEqual(bookId);
    expect(bookFound.barCode).toEqual(bookBarCode);
    expect(bookFound.title).toEqual(bookTitle);
    expect(bookFound.author).toEqual(bookAuthor);
    expect(bookFound.genre).toEqual(bookGenre);
    expect(bookFound.stock).toEqual(1);
    expect(bookFound.image).toEqual(bookImage);
  });
  

  it('should thow Genre is not supporte', async () => {
    const bookId = '84dbed59-9e56-4dd2-96fb-59c5ae11bd54';
    const bookBarCode = '979-8858358268';
    const bookTitle = 'Twilight';
    const bookAuthor = 'Stephenie Meyer';
    const bookGenre = 'Dummy';
    const bookImage = 'image.jpg';
 
    await expect(createBook.execute(bookId, bookBarCode, bookTitle, bookAuthor, bookGenre, bookImage)).rejects
    .toThrow('Genre is not supported');
      
  });
  
});

 




  

