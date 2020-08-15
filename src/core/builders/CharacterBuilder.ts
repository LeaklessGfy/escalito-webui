import { IBehavioral } from '../../entities/game/IBehavioral';
import { IScene } from '../../entities/game/IScene';
import { Client } from '../../entities/static/Client';
import { Employee } from '../../entities/static/Employee';
import { Sponsor } from '../../entities/static/Sponsor';
import { Barmaid } from '../characters/Barmaid';
import { ClientGo } from '../characters/ClientGo';
import { SponsorGo } from '../characters/SponsorGo';
import { BarmaidBuilder } from './BarmaidBuilder';
import { ClientBuilder } from './ClientBuilder';
import { EmployeeBuilder } from './EmployeeBuilder';
import { SponsorBuilder } from './SponsorBuilder';

export class CharacterBuilder {
  private readonly _barmaidBuilder: BarmaidBuilder;
  private readonly _clientBuilder: ClientBuilder;
  private readonly _employeeBuilder: EmployeeBuilder;
  private readonly _sponsorBuilder: SponsorBuilder;

  public constructor(scene: IScene) {
    this._barmaidBuilder = new BarmaidBuilder(scene);
    this._clientBuilder = new ClientBuilder(scene);
    this._employeeBuilder = new EmployeeBuilder(scene);
    this._sponsorBuilder = new SponsorBuilder(scene);
  }

  public buildBarmaid(): Barmaid {
    return this._barmaidBuilder.build();
  }

  public buildClient(client: Client): ClientGo {
    return this._clientBuilder.build(client);
  }

  public buildEmployee(employee: Employee): IBehavioral {
    return this._employeeBuilder.build(employee);
  }

  public buildSponsor(sponsor: Sponsor): SponsorGo {
    return this._sponsorBuilder.build(sponsor);
  }
}
