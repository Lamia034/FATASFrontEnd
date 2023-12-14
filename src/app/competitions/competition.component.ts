
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionService } from './competition.service';

import { ReactiveFormsModule } from '@angular/forms';
import {Competition} from "./competition";
import {MemberService} from "../members/member.service";
import {RankingService} from "../rankings/ranking.service";


@Component({
  selector: 'app-competitions',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css']
})
export class CompetitionComponent implements OnInit {
  competitions: Competition[] = [];
  competitionDate: Date = new Date();
  isAssignMode:boolean  =false;
  assignForm!:FormGroup;
  isUpdateMode: boolean = false;
  selectedCompetitionId: string = '';
  updateForm!: FormGroup;
  showAddForm = false;
  addForm!: FormGroup;

  constructor(
    private competitionService: CompetitionService,
    private memberService: MemberService,
    private rankingService: RankingService,
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

    this.assignForm = this.formBuilder.group({
      memberNum: new FormControl( Validators.required)
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
      const CompetitionStartTime = this.updateForm.value.competitionStartTime;
      const CompetitionEndTime = this.updateForm.value.competitionEndTime;
      const CompetitionLocation = this.updateForm.value.competitionLocation;
      const competitionNBParticipants = this.updateForm.value.competitionNBParticipants;
      // const CompetitionStartTime = this.addForm.value.startTime;
      // const CompetitionEndTime = this.addForm.value.endTime;
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


  assignMember(competitionId: string) {
    // Set the competition ID to the selectedCompetitionId
    this.selectedCompetitionId = competitionId;
    // Set isAssignMode to true to display the form
    this.isAssignMode = true;
  }

  submitAssign() {
    if (this.assignForm.valid) {
      const memberNum = this.assignForm.value.memberNum;

      // Call your memberService to check if the member exists
      this.memberService.getMemberById(memberNum).subscribe(
        (member: any) => {
          if (member) {
            const addedRanking = {
              num: memberNum,
              code: this.selectedCompetitionId // Use the selectedCompetitionId here
            };

            // Add the ranking (assign the member to the competition)
            this.rankingService.addRanking(addedRanking).subscribe(
              (rankingResponse: any) => {
                console.log('Ranking Added successfully');
                this.cancelAssign(); // Close the form or perform other actions
                // Optionally, you can fetch the competitions again after assigning the member
                this.fetchCompetitions();
              },
              (rankingError: any) => {
                console.error('Error adding ranking:', rankingError);
                // Handle ranking error - show an error message or perform other actions
              }
            );
          } else {
            console.log('Member does not exist or returned null');
            // Handle null member - show an error message or perform other actions
          }
        },
        (error) => {
          console.error('Error fetching member:', error);
          // Handle error - show an error message or perform other actions
        }
      );
    }
  }


  // assignMember(competitionId: string) {
  //   this.isAssignMode = true;
  //   this.selectedCompetitionId = competitionId;
  //   const competition = this.competitions.find(a => a.code === competitionId);
  //   console.log(competition);
  //
  //   if (this.assignForm.valid) {
  //     const memberNum = this.assignForm.value.memberNum;
  //
  //     const addedRanking = {
  //       num: memberNum,
  //       code: competitionId
  //     };
  //
  //     this.memberService.getMemberById(memberNum).subscribe(
  //       (member: any) => {
  //         if (member) {
  //           this.rankingService.addRanking(addedRanking).subscribe(
  //             (rankingResponse: any) => {
  //               console.log('Ranking Added successfully');
  //               this.cancelAdd();
  //               this.fetchCompetitions();
  //             },
  //             (rankingError: any) => {
  //               console.error('Error adding ranking:', rankingError);
  //               // Handle ranking error - show an error message or perform other actions
  //             }
  //           );
  //         } else {
  //           console.log('Member does not exist or returned null');
  //           // Handle null member - show an error message or perform other actions
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching member:', error);
  //         // Handle error - show an error message or perform other actions
  //       }
  //     );
  //   }
  // }











  // assignMember(competitionId: string) {
  //   this.isAssignMode = true;
  //   this.selectedCompetitionId = competitionId;
  //   const competition = this.competitions.find(a => a.code === competitionId);
  //   console.log(competition);
  //
  //   if (this.assignForm.valid) {
  //     const memberNum = this.assignForm.value.memberNum;
  //
  //     this.memberService.getMemberById(memberNum).subscribe(
  //       (member: any) => {
  //         if (member) {
  //           const addedRanking = {
  //             num: memberNum,
  //             code: competitionId
  //           };
  //
  //           this.rankingService.addRanking(addedRanking).subscribe(
  //             (rankingResponse: any) => {
  //               console.log('Ranking Added successfully');
  //               this.cancelAdd();
  //               this.fetchCompetitions();
  //             },
  //             (rankingError: any) => {
  //               console.error('Error adding ranking:', rankingError);
  //               // Handle ranking error - show an error message or perform other actions
  //             }
  //           );
  //         } else {
  //           console.log('Member does not exist or returned null');
  //           // Handle null member - show an error message or perform other actions
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching member:', error);
  //         // Handle error - show an error message or perform other actions
  //       }
  //     );
  //   }
  // }


  cancelAssign() {
    this.assignForm.reset();
    this.isAssignMode = false;
  }
  // assignMember(competitionId: string) {
  //
  //   this.isAssignMode = true;
  //   this.selectedCompetitionId = competitionId;
  //   const competition = this.competitions.find(a => a.code === competitionId);
  //   console.log(competition)
  //   if (this.assignForm.valid) {
  //     const memberNum = this.assignForm.value.memberNum;
  //     if (this.memberService.getMemberById(memberNum) != null) {
  //       const addedRanking = {
  //         num: memberNum,
  //         code: competitionId
  //       };
  //       this.rankingService.addRanking(addedRanking).subscribe(
  //         (response) => {
  //           console.log('Member Assigned successfully');
  //           this.cancelAdd();
  //           this.fetchCompetitions();
  //         },
  //         (error) => {
  //           console.error('Error assign competition:', error);
  //         }
  //       );
  //     }
  //   }else{
  //
  //   }
  // }
}
