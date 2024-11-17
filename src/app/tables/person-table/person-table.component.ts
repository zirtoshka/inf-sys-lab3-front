import {ChangeDetectorRef, Component, inject, ViewChild} from '@angular/core';
import {Person} from '../../dragondto/person';
import {Color} from '../../dragondto/color';
import {Country} from '../../dragondto/country';
import {NzTableComponent, NzThAddOnComponent} from 'ng-zorro-antd/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzPopconfirmDirective} from 'ng-zorro-antd/popconfirm';
import {CoordinatesFormComponent} from '../../forms/coordinates-form/coordinates-form.component';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {PersonFormComponent} from '../../forms/person-form/person-form.component';
import {PersonService} from '../../services/person.service';
import {BubukaComponent} from '../../bubuka/bubuka.component';
import {Location} from '../../dragondto/location';

@Component({
  selector: 'app-person-table',
  standalone: true,
  imports: [
    NzThAddOnComponent,
    ReactiveFormsModule,
    NzTableComponent,
    FormsModule,
    NgForOf,
    NzButtonComponent,
    NzPopconfirmDirective,
    CoordinatesFormComponent,
    NzModalComponent,
    PersonFormComponent,
    BubukaComponent,
    NgIf
  ],
  providers: [NzModalService],
  templateUrl: './person-table.component.html',
  styleUrl: './person-table.component.css'
})
export class PersonTableComponent {
  private personService = inject(PersonService);
  @ViewChild(PersonFormComponent) personFormComponent!: PersonFormComponent;
  isPersonModalVisible = false;
  dataEdit: Person | null;

  listOfPeople: Person[] = [
    {
      id: 1,
      name: 'Иван Иванов',
      eyeColor: Color.RED,
      hairColor: Color.BROWN,
      location: {id: 1, x: 10, y: 20, z: 30, name: 'Москва', canEdit: true},
      height: 175,
      passportID: '123456789',
      nationality: Country.USA,
      canEdit: true
    },
    {
      id: 2,
      name: 'Анна Смирнова',
      eyeColor: Color.BLUE,
      hairColor: Color.YELLOW,
      location: {id: 2, x: 15, y: 25, z: 35, name: 'Санкт-Петербург', canEdit: true},
      height: 165,
      passportID: '987654321',
      nationality: Country.GERMANY,
      canEdit: true
    },
    {
      id: 3,
      name: 'Максим Петров',
      eyeColor: Color.WHITE,
      hairColor: Color.RED,
      location: {id: 3, x: 20, y: 30, z: 40, name: 'Екатеринбург', canEdit: true},
      height: null,
      passportID: '1122334455',
      nationality: Country.FRANCE,
      canEdit: true
    }
  ];

  constructor(private cd: ChangeDetectorRef) {
    this.dataEdit = null;
  }

  sortOrderId: 'ascend' | 'descend' | null = null;
  sortOrderName: 'ascend' | 'descend' | null = null;
  sortOrderEyeColor: 'ascend' | 'descend' | null = null;
  sortOrderHairColor: 'ascend' | 'descend' | null = null;
  sortOrderLocation: 'ascend' | 'descend' | null = null;
  sortOrderHeight: 'ascend' | 'descend' | null = null;
  sortOrderPassportID: 'ascend' | 'descend' | null = null;
  sortOrderNationality: 'ascend' | 'descend' | null = null;

  sort(key: keyof Person): void {
    if (key === 'id') {
      this.sortOrderId = this.sortOrderId === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'name') {
      this.sortOrderName = this.sortOrderName === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'eyeColor') {
      this.sortOrderEyeColor = this.sortOrderEyeColor === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'hairColor') {
      this.sortOrderHairColor = this.sortOrderHairColor === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'location') {
      this.sortOrderLocation = this.sortOrderLocation === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'height') {
      this.sortOrderHeight = this.sortOrderHeight === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'passportID') {
      this.sortOrderPassportID = this.sortOrderPassportID === 'ascend' ? 'descend' : 'ascend';
    } else if (key === 'nationality') {
      this.sortOrderNationality = this.sortOrderNationality === 'ascend' ? 'descend' : 'ascend';
    }

    this.listOfPeople.sort((a, b) => {
      if (key === 'id') {
        return this.sortOrderId === 'ascend' ? a.id - b.id : b.id - a.id;
      } else if (key === 'name') {
        return this.sortOrderName === 'ascend' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (key === 'eyeColor') {
        return this.sortOrderEyeColor === 'ascend' ? a.eyeColor.localeCompare(b.eyeColor) : b.eyeColor.localeCompare(a.eyeColor);
      } else if (key === 'hairColor') {
        return this.sortOrderHairColor === 'ascend' ? a.hairColor.localeCompare(b.hairColor) : b.hairColor.localeCompare(a.hairColor);
      } else if (key === 'location') {
        return this.sortOrderLocation === 'ascend' ? a.location.name.localeCompare(b.location.name) : b.location.name.localeCompare(a.location.name);
      } else if (key === 'height') {
        return this.sortOrderHeight === 'ascend' ? (a.height || 0) - (b.height || 0) : (b.height || 0) - (a.height || 0);
      } else if (key === 'passportID') {
        return this.sortOrderPassportID === 'ascend' ? a.passportID.localeCompare(b.passportID) : b.passportID.localeCompare(a.passportID);
      } else if (key === 'nationality') {
        return this.sortOrderNationality === 'ascend' ? a.nationality.localeCompare(b.nationality) : b.nationality.localeCompare(a.nationality);
      }
      return 0;
    });
  }

  searchValue = '';

  onSearch(): void {
    this.listOfPeople = this.listOfPeople.filter(person =>
      person.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      person.passportID.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }


  deleteRow(id: number): void {
    this.personService.deletePerson(
      {id: id})
      .subscribe((res) => {
        console.log(res);
      })
    this.listOfPeople = this.listOfPeople.filter(d => d.id !== id);
  }


  handleOkCoordinates() {
    this.personFormComponent.updatePerson();
  }

  ngAfterViewChecked(): void {
    if (this.personFormComponent) {
      if (this.dataEdit) {
        this.personFormComponent.setDefaultData(this.dataEdit);


      }
      this.personFormComponent.hideAddButtonFn();
    }
    this.cd.detectChanges();

  }

  openEditModal(data: Person): void {
    this.isPersonModalVisible = true;
    this.dataEdit = data;

  }

  //location info
  isLocationModalVisible = false;
  selectedLocation: Location | null = null;

  openLocationModal(location: Location): void {
    this.selectedLocation = location;
    this.isLocationModalVisible = true;
    // this.cd.detectChanges();

  }

  handleCancel(): void {
    this.isLocationModalVisible = false;
  }

}
