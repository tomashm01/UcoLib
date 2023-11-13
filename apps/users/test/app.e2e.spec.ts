import { Test, TestingModule } from '@nestjs/testing';
import { CreateUser,UpdateUser,ReadAllUsers,ReadUser,DeleteUser, CREATE_USER } from '../src/application';
import {UserAlreadyExistsError } from '../src/domain';
import { USER_FINDER, UserFinder } from '../src/application';
import { UserRepository, USER_REPOSITORY } from '../src/domain/user/model/user.repository';
import { Inject } from '@nestjs/common';
import { UserDTO } from '../src/utils';
import { UserEmail, UserId } from '../src/domain/user/model';
import { UserModule } from '../src/infraestructure/app.module';
import { UserDocument, UserSchema } from '../src/infraestructure/projection';
import { UserMongoRepository } from '../src/infraestructure/service';
import { ApiGatewayTimeoutResponse } from '@nestjs/swagger';


// CREATE USER

describe('CreateUser', () => {

  let createUser: CreateUser;
  let userFinder: UserFinder;
  let userRepository: UserRepository;
  let repo: UserMongoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule], 
    }).compile();

    createUser = module.get<CreateUser>(CREATE_USER);
    userFinder = module.get<UserFinder>(USER_FINDER);
    userRepository = module.get<UserRepository>(USER_REPOSITORY);
    repo = module.get<UserMongoRepository>(USER_REPOSITORY);
    await repo.deleteALl();;
  });

  it('should be defined', () => {
    expect(createUser).toBeDefined();
  });

  it('should create a new user', async () => {

    const userId = 'a2c1f723-c2bc-47e9-92da-f070ff50b6ee';
    const userEmail = 'test1@example.com';
    const userPassword = 'password123';
    const userName = 'Test User';

  const createdUser = await createUser.execute(userId, userEmail, userPassword, userName);

    expect(createdUser).toBeDefined();
    expect(createdUser.id.value).toEqual(userId); 
    expect(createdUser.email.value).toEqual(userEmail);

    
  });

  it('should throw UserAlreadyExistsError if user with the same ID exists', async () => {

    const userId = '2ba3eed8-f8ba-4e62-9678-77f6bf2aefc7';
    const userEmail = 'test2@example.com';
    const userPassword = 'password123';
    const userName = 'Test User';

    await createUser.execute(userId, userEmail, userPassword, userName);

    await expect(createUser.execute(userId, userEmail, userPassword, userName)).rejects.toThrowError(
      UserAlreadyExistsError,
    );
    
  });

  it('should throw UserAlreadyExistsError if user with the same email exists', async () => {

    let userId = '767b4846-a742-4ef6-a3c5-adb94f55a4ff';
    const userEmail = 'test3@example.com';
    const userPassword = 'password123';
    const userName = 'Test User';

    await createUser.execute(userId, userEmail, userPassword, userName);

    userId = 'f715e145-15f7-42e3-8054-54c5aad8aa52';

    await expect(createUser.execute(userId, userEmail, userPassword, userName)).rejects.toThrowError(
      UserAlreadyExistsError,
    );
    
  });
});