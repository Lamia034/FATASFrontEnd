
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionService } from './competition.service';

import { ReactiveFormsModule } from '@angular/forms';
import {Competition} from "./competition";


@Component({
  selector: 'app-competitions',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
  competitions: Competition[] = [];
  competitionDate: Date = new Date();

  isUpdateMode: boolean = false;
  selectedCompetitionId: string = '';
  updateForm!: FormGroup;
  showAddForm = false;
  addForm!: FormGroup;

  constructor(
    private competitionService: CompetitionService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
    //  competitionCode: ['', Validators.required],
      competitionAmount: [ Validators.required],
      competitionDate: [ Validators.required],
      competitionStartTime: [Validators.required],
      competitionEndTime: [Validators.required],
      competitionLocation: ['', Validators.required],
      competitionNBParticipants: [Validators.required]
    });

    this.addForm = this.formBuilder.group({
      amount: new FormControl( Validators.required),
      date: new FormControl( Validators.required),
      startTime: new FormControl( Validators.required),
      endTime: new FormControl( Validators.required),
      location: new FormControl( Validators.required),
      nbParticipants: new FormControl( Validators.required)
    });



    const isCompetitionsRoute = this.route.snapshot.url[0]?.path === 'competitions';
    if (isCompetitionsRoute) {
      this.fetchCompetitions();

    }

  }




  fetchCompetitions() {
    this.competitionService.getCompetitions().subscribe(
      (data: Competition[]) => {
        this.competitions = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching competitions:', error);
      }
    );
  }



  deleteCompetition(competitionId: string) {
    this.competitionService.deleteCompetition(competitionId).subscribe({
      next: () => {
        console.log('Competition deleted successfully');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting competition:', error);
      }
    });
  }


  updateCompetition(competitionId: string) {
    this.isUpdateMode = true;
    this.selectedCompetitionId = competitionId;
    const competition = this.competitions.find(a => a.code === competitionId);
    console.log(competition)
    if (competition) {
      this.updateForm.patchValue({
        competitionAmount: competition.amount,
        competitionDate: competition.date,
        competitionStartTime: competition.startTime,
        competitionEndTime: competition.endTime,
        competitionNBParticipants: competition.numberOfParticipants,
        competitionLocation: competition.location
      });
    }
    console.log(competition);
  }

  cancelUpdate() {
    this.isUpdateMode = false;
    this.selectedCompetitionId = '';
    this.updateForm.reset();
  }

  submitUpdate() {
console.log(this.selectedCompetitionId);
    if (this.selectedCompetitionId !== null && this.selectedCompetitionId !== '' && this.updateForm.valid) {
      console.log("after");
      const CompetitionAmount = this.updateForm.value.competitionAmount;
      const CompetitionDate = this.updateForm.value.competitionDate;
      // const CompetitionStartTime = this.updateForm.value.competitionStartTime;
      // const CompetitionEndTime = this.updateForm.value.competitionEndTime;
      const CompetitionLocation = this.updateForm.value.competitionLocation;
      const competitionNBParticipants = this.updateForm.value.competitionNBParticipants;
      const CompetitionStartTime = this.addForm.value.startTime;
      const CompetitionEndTime = this.addForm.value.endTime;
      console.log(competitionNBParticipants);


      const updatedCompetition = {
        amount: CompetitionAmount,
        date: CompetitionDate,
        startTime:CompetitionStartTime,
        endTime:CompetitionEndTime,
        location:CompetitionLocation,
        numberOfParticipants:competitionNBParticipants

      };
      console.log("here");

      this.competitionService.updateCompetition(this.selectedCompetitionId, updatedCompetition).subscribe(
        (response) => {
          console.log('Competition updated successfully');
          this.cancelUpdate();

          this.fetchCompetitions();
          console.log("fetched?");
        },
        (error) => {
          console.error('Error updating competition:', error);
        }
      );
    }
  }


  submitNewCompetition() {
    console.log('Submit new competition method called');
    if (this.addForm.valid) {
      const newAmount = this.addForm.value.amount;
      const Date = this.addForm.value.date;
      const startTime = this.addForm.value.startTime;
      const endTime = this.addForm.value.endTime;
      const location = this.addForm.value.location;
      const nbOfParticipants = this.addForm.value.nbParticipants;
      const code = this.createCompetitionCode(location, Date);

      const addedCompetition = {
        code:code,
        amount: newAmount,
        date: Date,
        startTime:startTime,
        endTime:endTime,
        location:location,
        numberOfParticipants:nbOfParticipants
      };
      console.log(addedCompetition);
      this.competitionService.addCompetition(addedCompetition).subscribe(
        (response) => {
          console.log('Competition created successfully');
          this.cancelAdd();
          this.fetchCompetitions();
        },
        (error) => {
          console.error('Error creating competition:', error);
        }
      );
    }
  }
  cancelAdd() {
    this.addForm.reset();
    this.showAddForm = false;
  }
  createCompetitionCode(location: string, date: string): string {
    const formattedDate = new Date(date);
    const day = ('0' + formattedDate.getDate()).slice(-2);
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2);
    const year = formattedDate.getFullYear().toString().slice(-2);
    const locationCode = location.substr(0, 3).toLowerCase();
    const competitionCode = `${locationCode}-${day}-${month}-${year}`;

    return competitionCode;
  }

}
