
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from './member.service';

import { ReactiveFormsModule } from '@angular/forms';
import {IdentityDocumentType, Member} from "./member";


@Component({
  selector: 'app-members',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  types: string[] = Object.values(IdentityDocumentType);
  members: Member[] = [];
  accessionDate: Date = new Date();
  isUpdateMode: boolean = false;
  selectedMemberId: number | null = null;
  updateForm!: FormGroup;
  showAddForm = false;
  addForm!: FormGroup;

  constructor(
    private memberService: MemberService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateForm = this.formBuilder.group({
    //  memberNum: ['', Validators.required],
      memberName: ['', Validators.required],
      memberFamilyName: ['', Validators.required],
      memberAccessionDate: ['', Validators.required],
  //    memberIdentityDocument: ['', Validators.required],
      memberIdentityNumber: ['', Validators.required],
      documentType: [Validators.required],
      memberNationality: ['', Validators.required]
    });

    this.addForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      familyName: new FormControl( '',Validators.required),
      accessionDate: new FormControl( Validators.required),
      nationality: new FormControl('', Validators.required),
   //   identityDocument: new FormControl( Validators.required),
      identityNumber: new FormControl('', Validators.required),
      type: new FormControl(Validators.required)
    });



    const isMembersRoute = this.route.snapshot.url[0]?.path === 'members';
    if (isMembersRoute) {
      this.fetchMembers();

    }

  }




  fetchMembers() {
    this.memberService.getMembers().subscribe(
      (data: Member[]) => {
        this.members = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching members:', error);
      }
    );
  }



  deleteMember(memberId: number) {
    this.memberService.deleteMember(memberId).subscribe({
      next: () => {
        console.log('Member deleted successfully');
        window.location.reload();
      },
      error: (error) => {
        console.error('Error deleting member:', error);
      }
    });
  }


  updateMember(memberId: number) {
    this.isUpdateMode = true;
    this.selectedMemberId = memberId;
    const member = this.members.find(a => a.num === memberId);
    console.log(member)
    if (member) {
      this.updateForm.patchValue({
        memberName: member.name,
        memberFamilyName: member.familyName,
        memberAccessionDate: member.accessionDate,
        memberNationality: member.nationality,
        memberIdentityDocument: member.identityDocument,
        memberIdentityNumber: member.identityNumber
      });
    }
    console.log(member);
  }

  cancelUpdate() {
    this.isUpdateMode = false;
    this.selectedMemberId = null;
    this.updateForm.reset();
  }

  submitUpdate() {
    console.log(this.selectedMemberId);
    if (this.selectedMemberId !== null && this.updateForm.valid) {
      console.log("after");
      const MemberName = this.updateForm.value.memberName;
      const MemberFamilyName = this.updateForm.value.memberFamilyName;
      const MemberAccessionDate = this.updateForm.value.memberAccessionDate;
      const MemberNationality = this.updateForm.value.memberNationality;
      const MemberIdentityDocument = this.updateForm.value.documentType;
      const memberIdentityNumber = this.updateForm.value.memberIdentityNumber;



      const updatedMember = {
        name: MemberName,
        familyName: MemberFamilyName,
        accessionDate:MemberAccessionDate,
        nationality:MemberNationality,
        identityDocument:MemberIdentityDocument,
        identityNumber:memberIdentityNumber

      };
      console.log("here");

      this.memberService.updateMember(this.selectedMemberId, updatedMember).subscribe(
        (response) => {
          console.log('Member updated successfully');
          this.cancelUpdate();

          this.fetchMembers();
          console.log("fetched?");
        },
        (error) => {
          console.error('Error updating member:', error);
        }
      );
    }
  }


  submitNewMember() {
    console.log('Submit new member method called');
    if (this.addForm.valid) {
      const newName = this.addForm.value.name;
      const familyName = this.addForm.value.familyName;
      const accessionDate = this.addForm.value.accessionDate;
      const nationality = this.addForm.value.nationality;
      const identityDocument = this.addForm.value.type;
      const identityNumber = this.addForm.value.identityNumber;


      const addedMember = {
        //code:code,
        name: newName,
        familyName: familyName,
        accessionDate:accessionDate,
        nationality:nationality,
        identityDocument:identityDocument,
        identityNumber:identityNumber
      };
      console.log(addedMember);
      this.memberService.addMember(addedMember).subscribe(
        (response) => {
          console.log('Member created successfully');
          this.cancelAdd();
          this.fetchMembers();
        },
        (error) => {
          console.error('Error creating member:', error);
        }
      );
    }
  }
  cancelAdd() {
    this.addForm.reset();
    this.showAddForm = false;
  }


}
