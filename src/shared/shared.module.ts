import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthTokenRepo } from '@shared/repos/authToken.repo';
import { FilesRepo } from '@shared/repos/files.repo';
import { TokenLogs } from '@shared/repos/tokenLogs.repo';
import { UsersRepo } from '@shared/repos/users.repo';

const repos = [AuthTokenRepo, FilesRepo, TokenLogs, UsersRepo];

const modules = [
  HttpModule.register({
    maxRedirects: 5,
  }),
];

const providers = [];

@Module({
  imports: [...modules],
  providers: [...repos, ...providers],
  exports: [...modules, ...repos, ...providers],
})
export class SharedModule {}
