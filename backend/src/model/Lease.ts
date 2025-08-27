export class Lease{
    private id: number;
    private userId: number;
    private sportItemId: number;


    static builder() {
        let _id: number,
            _userId: number,
            _sportItemId: number;
        return {
            id(id: number) {_id = id;return this;},
            userId(userId: number) {_userId = userId;return this;},
            sportItemId(sportItemId: number) {_sportItemId = sportItemId;return this;},
            build() {return new Lease(_id, _userId, _sportItemId);}
        };
    }
    constructor(id?: number, userId?: number, sportItemId?: number) {
        this.id = id || 0;
        this.userId = userId || 0;
        this.sportItemId = sportItemId || 0;
    }

    public getId(): number {
        return this.id;
    }
    public getUserId(): number {
        return this.userId;
    }
    public getSportItemId(): number {
        return this.sportItemId;
    }
    public setId(id: number): void {
        this.id = id;
    }
    public setUserId(userId: number): void {
        this.userId = userId;
    }
    public setSportItemId(sportItemId: number): void {
        this.sportItemId = sportItemId;
    }
};